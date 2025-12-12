import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// サービスアカウントの設定
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';

// サービスアカウント認証でGoogle Drive APIクライアントを初期化
const getDriveClient = () => {
  try {
    const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });
    
    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('サービスアカウント認証エラー:', error);
    throw error;
  }
};

// 画像をプロキシして返す
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const size = searchParams.get('size') || 'thumbnail'; // thumbnail, medium, large, original

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const drive = getDriveClient();

    // まずファイルのメタデータを取得してMIMEタイプを確認
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'mimeType,thumbnailLink',
      supportsAllDrives: true
    });

    const mimeType = fileMetadata.data.mimeType || 'image/jpeg';
    
    // サムネイルサイズの場合は、Google DriveのサムネイルURLを使用（レート制限に注意）
    // ただし、429エラーを避けるため、API経由で取得する
    // サムネイルURLがある場合はそれを使用（動画の場合など）
    const thumbnailLink = fileMetadata.data.thumbnailLink;
    
    // 画像ファイルの場合は、常にAPI経由で取得（レート制限回避）
    if (mimeType.startsWith('image/')) {
      // ファイルを取得（バイナリデータ）
      const response = await drive.files.get(
        {
          fileId: fileId,
          alt: 'media',
          supportsAllDrives: true
        },
        {
          responseType: 'stream'
        }
      );

      // レスポンスヘッダーを設定（ORB対策）
      const headers = new Headers();
      headers.set('Content-Type', mimeType);
      headers.set('Cache-Control', 'public, max-age=3600');
      // CORSヘッダーを追加（ORB対策）
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      // Cross-Origin-Resource-Policyヘッダーを追加
      headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
      // X-Content-Type-Optionsヘッダーを追加
      headers.set('X-Content-Type-Options', 'nosniff');

      // ストリームをバッファに変換
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        response.data.on('end', () => resolve());
        response.data.on('error', reject);
      });
      const buffer = Buffer.concat(chunks);

      return new NextResponse(buffer, {
        status: 200,
        headers
      });
    } else {
      // 動画ファイルなどの場合は、サムネイルURLをリダイレクト
      if (thumbnailLink) {
        return NextResponse.redirect(thumbnailLink);
      } else {
        return NextResponse.json(
          { error: 'Thumbnail not available' },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('画像取得エラー:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

