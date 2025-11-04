import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// サービスアカウントの設定
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID2 || '';
console.log('FOLDER_ID', FOLDER_ID);
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

// フォルダ一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'folders') {
      const drive = getDriveClient();

      // 指定されたフォルダ内のフォルダ一覧を取得
      // Shared Drive対応のため、supportsAllDrives と includeItemsFromAllDrives を追加
      const foldersResponse = await drive.files.list({
        q: `'${FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id,name,createdTime,modifiedTime,webViewLink,size)",
        orderBy: "name",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        corpora: 'allDrives'
      });

      const folders = foldersResponse.data.files || [];

      // 各フォルダの詳細情報を取得
      const detailedFolders = await Promise.all(
        folders.map(async (folder) => {
          try {
            const filesResponse = await drive.files.list({
              q: `'${folder.id}' in parents and trashed=false`,
              fields: "files(id,name,mimeType)",
              orderBy: "name",
              supportsAllDrives: true,
              includeItemsFromAllDrives: true,
              corpora: 'allDrives'
            });

            const files = filesResponse.data.files || [];
            const fileNames = files.map(file => file.name || '');
            
            // サブフォルダの確認
            const subFolders = files.filter(file => 
              file.mimeType === 'application/vnd.google-apps.folder'
            );
            const subFolderNames = subFolders.map(folder => folder.name || '');

            // 動画ファイルのみをカウント
            const videoFiles = files.filter(file => 
              file.mimeType && (file.mimeType.includes('video/') || file.mimeType.includes('application/octet-stream'))
            );
            const videoFileCount = videoFiles.length;

            // resultフォルダ、Completeフォルダ、Uploadingフォルダの存在確認
            const hasResultFolder = subFolders.some(folder => 
              folder.name?.toLowerCase().includes('result')
            );
            const hasCompleteFolder = subFolders.some(folder => 
              folder.name?.toLowerCase().includes('complete')
            );
            const hasUploadingFolder = subFolders.some(folder => 
              folder.name?.toLowerCase().includes('uploading')
            );

            return {
              id: folder.id || '',
              name: folder.name || '',
              createdTime: folder.createdTime || '',
              modifiedTime: folder.modifiedTime || '',
              webViewLink: folder.webViewLink || '',
              fileCount: videoFileCount, // 動画ファイルのみの数
              fileNames: videoFiles.map(file => file.name || ''), // 動画ファイル名のみ
              subFolderNames,
              hasResultFolder,
              hasCompleteFolder,
              hasUploadingFolder
            };
          } catch (error) {
            console.error(`フォルダ ${folder.name} の詳細取得エラー:`, error);
            return {
              id: folder.id || '',
              name: folder.name || '',
              createdTime: folder.createdTime || '',
              modifiedTime: folder.modifiedTime || '',
              webViewLink: folder.webViewLink || '',
              fileCount: 0,
              fileNames: [],
              subFolderNames: [],
              hasResultFolder: false,
              hasCompleteFolder: false,
              hasUploadingFolder: false
            };
          }
        })
      );

      // processed_videosフォルダを除外
      const filteredFolders = detailedFolders.filter(folder => 
        folder.name !== 'processed_videos'
      );
      
      // フォルダ名順でソート
      const sortedFolders = filteredFolders.sort((a, b) => 
        a.name.localeCompare(b.name, 'ja-JP', { numeric: true, sensitivity: 'base' })
      );

      return NextResponse.json({ 
        folders: sortedFolders,
        folderId: FOLDER_ID // デバッグ用
      });
    } else if (action === 'checkUploading') {
      const folderId = searchParams.get('folderId');
      if (!folderId) {
        return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
      }

      const drive = getDriveClient();
      
      // Uploadingフォルダの存在を確認
      // Shared Drive対応のため、supportsAllDrives と includeItemsFromAllDrives を追加
      const response = await drive.files.list({
        q: `'${folderId}' in parents and name='Uploading' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id,name)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        corpora: 'allDrives'
      });
      
      const uploadingFolders = response.data.files || [];
      const hasUploadingFolder = uploadingFolders.length > 0;
      
      return NextResponse.json({ hasUploadingFolder });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Drive API エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error'}, 
      { status: 500 }
    );
  }
} 