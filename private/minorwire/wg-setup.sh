#!/usr/bin/env bash
#
# WireGuard server bootstrap for Oracle Cloud Infrastructure (Ubuntu)
# Used by MinorWire after the compute instance is reachable over SSH.
#
# Usage:  sudo bash wg-setup.sh
#
set -euo pipefail

WG_IF="wg0"
WG_PORT="51820"
WG_V4_NET="10.66.66.0/24"
WG_V4_SRV="10.66.66.1/24"
WG_V6_NET="fd66:66:66::/64"
WG_V6_SRV="fd66:66:66::1/64"
WG_DIR="/etc/wireguard"

log() { printf '==> %s\n' "$*"; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

[[ ${EUID} -eq 0 ]] || die "run as root: sudo bash $0"
if [[ -e /etc/wireguard/${WG_IF}.conf ]]; then
  if systemctl is-active --quiet "wg-quick@${WG_IF}" 2>/dev/null || wg show "${WG_IF}" >/dev/null 2>&1; then
    log "WireGuard already configured on ${WG_IF}; skipping bootstrap"
    exit 0
  fi
  die "${WG_DIR}/${WG_IF}.conf already exists but interface is not up; move it aside before re-running"
fi

log "Installing packages"
export DEBIAN_FRONTEND=noninteractive
echo "iptables-persistent iptables-persistent/autosave_v4 boolean true" | debconf-set-selections
echo "iptables-persistent iptables-persistent/autosave_v6 boolean true" | debconf-set-selections
apt-get update -qq
apt-get install -y -qq wireguard wireguard-tools iptables-persistent qrencode curl

WAN_IF="$(ip -4 route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="dev"){print $(i+1); exit}}')"
[[ -n "${WAN_IF}" ]] || die "could not detect WAN interface"
log "WAN interface: ${WAN_IF}"

if [[ -z "${PUBLIC_IP:-}" ]]; then
  PUBLIC_IP="$(curl -fsS --max-time 10 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || true)"
fi
if [[ ! "${PUBLIC_IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  die "Public IP auto-detect failed; set PUBLIC_IP env before running"
fi
log "Public IP: ${PUBLIC_IP}"

log "Enabling IP forwarding"
cat > /etc/sysctl.d/99-wireguard.conf <<'EOF'
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
EOF
sysctl --system -q

# OCI Ubuntu images often end INPUT/FORWARD with REJECT — insert accepts first.
log "Inserting iptables allow rules for UDP ${WG_PORT}"
if ! iptables -C INPUT -p udp --dport "${WG_PORT}" -j ACCEPT 2>/dev/null; then
  iptables -I INPUT 1 -p udp --dport "${WG_PORT}" -j ACCEPT
fi
if ! ip6tables -C INPUT -p udp --dport "${WG_PORT}" -j ACCEPT 2>/dev/null; then
  ip6tables -I INPUT 1 -p udp --dport "${WG_PORT}" -j ACCEPT || true
fi
netfilter-persistent save >/dev/null

log "Generating server keys"
install -d -m 700 "${WG_DIR}/keys"
umask 077
wg genkey > "${WG_DIR}/keys/server.key"
wg pubkey < "${WG_DIR}/keys/server.key" > "${WG_DIR}/keys/server.pub"
SRV_PRIV="$(cat "${WG_DIR}/keys/server.key")"

log "Writing ${WG_DIR}/${WG_IF}.conf"
cat > "${WG_DIR}/${WG_IF}.conf" <<EOF
# managed by MinorWire / wg-setup.sh
# Endpoint : ${PUBLIC_IP}:${WG_PORT}
# WAN if   : ${WAN_IF}
[Interface]
Address    = ${WG_V4_SRV}, ${WG_V6_SRV}
ListenPort = ${WG_PORT}
PrivateKey = ${SRV_PRIV}

PostUp   = iptables  -I FORWARD 1 -i %i -j ACCEPT
PostUp   = iptables  -I FORWARD 1 -o %i -j ACCEPT
PostUp   = iptables  -t nat -I POSTROUTING 1 -s ${WG_V4_NET} -o ${WAN_IF} -j MASQUERADE
PostUp   = ip6tables -I FORWARD 1 -i %i -j ACCEPT
PostUp   = ip6tables -I FORWARD 1 -o %i -j ACCEPT
PostUp   = ip6tables -t nat -I POSTROUTING 1 -s ${WG_V6_NET} -o ${WAN_IF} -j MASQUERADE

PostDown = iptables  -D FORWARD -i %i -j ACCEPT
PostDown = iptables  -D FORWARD -o %i -j ACCEPT
PostDown = iptables  -t nat -D POSTROUTING -s ${WG_V4_NET} -o ${WAN_IF} -j MASQUERADE
PostDown = ip6tables -D FORWARD -i %i -j ACCEPT
PostDown = ip6tables -D FORWARD -o %i -j ACCEPT
PostDown = ip6tables -t nat -D POSTROUTING -s ${WG_V6_NET} -o ${WAN_IF} -j MASQUERADE
EOF
chmod 600 "${WG_DIR}/${WG_IF}.conf"

cat > "${WG_DIR}/server.env" <<EOF
PUBLIC_IP=${PUBLIC_IP}
WG_PORT=${WG_PORT}
WG_IF=${WG_IF}
EOF
chmod 600 "${WG_DIR}/server.env"

log "Enabling wg-quick@${WG_IF}"
systemctl enable --now "wg-quick@${WG_IF}"

log "Installing /usr/local/bin/wg-add-peer"
cat > /usr/local/bin/wg-add-peer <<'PEEREOF'
#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-}"
[[ -n "${NAME}" ]] || { echo "usage: sudo wg-add-peer <name>"; exit 1; }
[[ "${NAME}" =~ ^[A-Za-z0-9_-]+$ ]] || { echo "name must be alphanumeric / - / _"; exit 1; }
[[ ${EUID} -eq 0 ]] || { echo "run as root"; exit 1; }

# shellcheck disable=SC1091
source /etc/wireguard/server.env
CONF="/etc/wireguard/${WG_IF}.conf"
OUT="/etc/wireguard/clients"
install -d -m 700 "${OUT}"
[[ -e "${OUT}/${NAME}.conf" ]] && { echo "peer ${NAME} already exists"; exit 1; }

USED="$(grep -oE '10\.66\.66\.[0-9]+' "${CONF}" | cut -d. -f4 | sort -n -u)"
OCTET=""
for i in $(seq 2 254); do
  grep -qx "${i}" <<<"${USED}" || { OCTET="${i}"; break; }
done
[[ -n "${OCTET}" ]] || { echo "IP pool exhausted"; exit 1; }

umask 077
PRIV="$(wg genkey)"
PUB="$(wg pubkey <<<"${PRIV}")"
PSK="$(wg genpsk)"
SRV_PUB="$(cat /etc/wireguard/keys/server.pub)"

cat >> "${CONF}" <<EOF

[Peer]
# ${NAME}  (added $(date -Is))
PublicKey           = ${PUB}
PresharedKey        = ${PSK}
AllowedIPs          = 10.66.66.${OCTET}/32, fd66:66:66::${OCTET}/128
EOF

cat > "${OUT}/${NAME}.conf" <<EOF
[Interface]
PrivateKey = ${PRIV}
Address    = 10.66.66.${OCTET}/32, fd66:66:66::${OCTET}/128
DNS        = 1.1.1.1, 1.0.0.1

[Peer]
PublicKey           = ${SRV_PUB}
PresharedKey        = ${PSK}
Endpoint            = ${PUBLIC_IP}:${WG_PORT}
AllowedIPs          = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
EOF
chmod 600 "${OUT}/${NAME}.conf"

wg syncconf "${WG_IF}" <(wg-quick strip "${WG_IF}")

echo
echo "=== added ${NAME} (10.66.66.${OCTET}) ==="
echo "config: ${OUT}/${NAME}.conf"
echo
qrencode -t ansiutf8 < "${OUT}/${NAME}.conf"
PEEREOF
chmod 755 /usr/local/bin/wg-add-peer

log "Done"
cat <<EOF

  Server public key : $(cat "${WG_DIR}/keys/server.pub")
  Endpoint          : ${PUBLIC_IP}:${WG_PORT}
  Status            : sudo wg show
  Add peer          : sudo wg-add-peer <name>

  Ensure OCI Security List / NSG allows UDP ${WG_PORT} from 0.0.0.0/0.
  Prefer OS reboot (sudo reboot) over console Stop/Start (ephemeral public IP).

EOF
