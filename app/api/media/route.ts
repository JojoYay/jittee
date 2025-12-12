import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// サービスアカウントの設定
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';
const DEFAULT_FOLDER_ID = process.env.BVS_FOLDER_ID || '';
console.log('DEFAULT_FOLDER_ID', DEFAULT_FOLDER_ID);
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

// 写真・動画ファイルのMIMEタイプを判定
const isImageFile = (mimeType: string): boolean => {
  return mimeType?.startsWith('image/') || false;
};

const isVideoFile = (mimeType: string): boolean => {
  return mimeType?.startsWith('video/') || false;
};

// ファイル一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId') || DEFAULT_FOLDER_ID;

    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    const drive = getDriveClient();

    // 指定されたフォルダ内のファイルとフォルダを取得
    // Shared Drive対応のため、supportsAllDrives と includeItemsFromAllDrives を追加
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,thumbnailLink,webViewLink,createdTime,modifiedTime,size,imageMediaMetadata,videoMediaMetadata,owners)',
      orderBy: 'modifiedTime desc',
      pageSize: 1000,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: 'allDrives'
    });

    const files = response.data.files || [];

    // ファイル情報を整形
    const mediaItems = await Promise.all(
      files.map(async (file) => {
        try {
          const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
          
          // フォルダの場合はシンプルな情報を返す
          if (isFolder) {
            return {
              id: file.id || '',
              name: file.name || '',
              mimeType: file.mimeType || '',
              thumbnailUrl: '',
              webViewLink: file.webViewLink || '',
              directUrl: '',
              createdTime: file.createdTime || '',
              modifiedTime: file.modifiedTime || '',
              size: '0',
              width: 0,
              height: 0,
              isImage: false,
              isVideo: false,
              isFolder: true
            };
          }

          // 画像・動画ファイルのみ処理
          if (!isImageFile(file.mimeType || '') && !isVideoFile(file.mimeType || '')) {
            return null;
          }

          // サムネイルURLを取得
          let thumbnailUrl = '';
          
          // 画像ファイルの場合は常にAPI経由で取得（レート制限回避のため）
          if (isImageFile(file.mimeType || '') && file.id) {
            // API経由で画像をプロキシするURL（レート制限を回避）
            thumbnailUrl = `/api/media/image?fileId=${file.id}`;
          } else if (isVideoFile(file.mimeType || '')) {
            // 動画ファイルの場合はサムネイルURLを使用（動画はサムネイルのみで十分）
            thumbnailUrl = file.thumbnailLink || '';
            // サムネイルがない場合は取得を試みる
            if (!thumbnailUrl) {
              try {
                const fileResponse = await drive.files.get({
                  fileId: file.id || '',
                  fields: 'thumbnailLink',
                  supportsAllDrives: true
                });
                thumbnailUrl = fileResponse.data.thumbnailLink || '';
              } catch (error) {
                console.error(`サムネイル取得エラー (${file.name}):`, error);
              }
            }
          }

          // 画像のメタデータから幅と高さを取得
          const width = file.imageMediaMetadata?.width || file.videoMediaMetadata?.width || 0;
          const height = file.imageMediaMetadata?.height || file.videoMediaMetadata?.height || 0;
          
          // EXIF情報を取得
          const exifData = file.imageMediaMetadata || {};
          const videoMetadata = file.videoMediaMetadata || {};
          
          // 撮影日時（EXIF DateTimeOriginal または DateTime）
          // @ts-ignore - Google Drive APIの型定義が不完全なため
          const dateTimeOriginal = exifData.time || (videoMetadata as any).time || file.createdTime || '';
          
          // 撮影者（所有者情報）
          const owner = file.owners && file.owners.length > 0 ? file.owners[0] : null;
          const photographer = owner?.displayName || owner?.emailAddress || '';
          
          // カメラ情報
          const camera = exifData.cameraMake || '';
          const model = exifData.cameraModel || '';
          
          // 位置情報
          const location = exifData.location ? {
            latitude: exifData.location.latitude || 0,
            longitude: exifData.location.longitude || 0,
            altitude: exifData.location.altitude || 0
          } : null;

          // 動画の直接表示URLを生成（サービスアカウント経由でアクセス可能なURL）
          // 注意: 実際の動画再生には、認証付きURLが必要な場合があります
          const directUrl = file.id 
            ? `https://drive.google.com/uc?export=view&id=${file.id}`
            : '';

          return {
            id: file.id || '',
            name: file.name || '',
            mimeType: file.mimeType || '',
            thumbnailUrl,
            webViewLink: file.webViewLink || '',
            directUrl, // 直接表示用URL
            createdTime: file.createdTime || '',
            modifiedTime: file.modifiedTime || '',
            size: file.size || '0',
            width,
            height,
            isImage: isImageFile(file.mimeType || ''),
            isVideo: isVideoFile(file.mimeType || ''),
            isFolder: false,
            // EXIF情報
            exif: {
              dateTimeOriginal,
              photographer,
              camera,
              model,
              location,
              exposureTime: exifData.exposureTime || '',
              // @ts-ignore - Google Drive APIの型定義が不完全なため
              fNumber: exifData.fNumber || exifData.aperture?.toString() || '',
              isoSpeed: exifData.isoSpeed?.toString() || '',
              focalLength: exifData.focalLength?.toString() || '',
              flashUsed: exifData.flashUsed || false,
              meteringMode: exifData.meteringMode || '',
              sensor: exifData.sensor || '',
              colorSpace: exifData.colorSpace || '',
              whiteBalance: exifData.whiteBalance || '',
              exposureMode: exifData.exposureMode || '',
              // 動画メタデータ
              durationMillis: videoMetadata.durationMillis || '',
              // @ts-ignore - Google Drive APIの型定義が不完全なため
              fps: (videoMetadata as any).fps || 0
            }
          };
        } catch (error) {
          console.error(`ファイル情報取得エラー (${file.name}):`, error);
          return null;
        }
      })
    );

    // nullを除外
    const validFiles = mediaItems.filter((item): item is NonNullable<typeof item> => item !== null);

    // フォルダとファイルを分けてソート（フォルダを先に、その後ファイル）
    const folders = validFiles.filter(item => item.isFolder);
    const mediaFiles = validFiles.filter(item => !item.isFolder);
    
    // フォルダは名前順、ファイルは更新日時順
    folders.sort((a, b) => a.name.localeCompare(b.name, 'ja-JP'));
    mediaFiles.sort((a, b) => {
      const dateA = new Date(a.modifiedTime).getTime();
      const dateB = new Date(b.modifiedTime).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      files: [...folders, ...mediaFiles],
      folders: folders,
      mediaFiles: mediaFiles,
      totalCount: validFiles.length,
      folderCount: folders.length,
      mediaCount: mediaFiles.length
    });
  } catch (error) {
    console.error('Drive API エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

