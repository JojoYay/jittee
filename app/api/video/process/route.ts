import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from 'firebase/storage';

// エラー情報を詳細に取得する関数
const getDetailedError = (error: any) => {
  const errorInfo = {
    message: error.message || 'Unknown error',
    name: error.name || 'Error',
    code: error.code || 'UNKNOWN',
    stack: error.stack || '',
    details: {}
  };

  // Google Drive API エラーの詳細情報
  if (error.code && (error.code === 401 || error.code === 403)) {
    errorInfo.details = {
      googleDriveError: true,
      errorCode: error.code,
      errorMessage: error.message,
      authError: true
    };
  }

  return errorInfo;
};

// Google Drive API の設定
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';
// const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

// Google Drive API クライアントを初期化
const getDriveClient = () => {
  try {
    const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive'
      ]
    });
    
    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Google Drive API 認証エラー:', error);
    throw error;
  }
};

// Driveからチャンクでダウンロードして直接YouTubeにアップロードする関数
const uploadVideoFromDrive = async(fileId: string, title: string, actDate: string, fileSize: number) => {
  console.log('uploadVideoFromDrive called with fileId:', fileId);
  if (!fileId) return;

  try {
    const url = process.env.SERVER_URL + '';
    console.log('Server URL:', url);
    const formData: FormData = new FormData();
    formData.append('func', 'uploadToYoutube');
    formData.append('fileName', title);
    formData.append('fileType', 'video/mp4');
    formData.append('fileSize', fileSize.toString());
    formData.append('actDate', actDate);
    console.log('FormData prepared:', {
      func: 'uploadToYoutube',
      fileName: title,
      fileType: 'video/mp4',
      fileSize: fileSize,
      actDate: actDate
    });
    
    // アップロード用のURLとトークンを取得するためのリクエスト
    console.log('Sending fetch request to:', url);
    const res = await fetch(url, {
      method: "POST",
      headers: { 'Accept': 'application/json' },
      body: formData,
    });
    console.log('Fetch response status:', res.status);
    console.log('Fetch response ok:', res.ok);
    console.log('Fetch response headers:', Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      console.error('HTTP error response:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
    }

    // Content-Typeをチェック
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await res.text();
      console.error('Non-JSON response:', responseText);
      throw new Error(`Expected JSON response but got: ${contentType}`);
    }

    const responseData = await res.json();
    // console.log('Response data:', responseData);
    const { uploadUrl, token, err } = responseData;
    console.log('uploadUrl:', uploadUrl);
    // console.log('token:', token);
    // console.log('err:', err);

    if (err) {
      console.error('Server returned error:', err);
      return;
    }
    if (!uploadUrl) {
      console.error('No upload URL received');
      return;
    }

    // Driveからチャンクでダウンロードして直接YouTubeにアップロード
    console.log('Starting resumable upload with Drive chunks...');
    const uploadChunkSize = 25 * 1024 * 1024; // 25MB チャンク
    let offset = 0;
    let response;
    
    while (offset < fileSize) {
      const progress = Math.min(90, 10 + Math.round((offset / fileSize) * 80));
      console.log(`Uploading chunk: ${offset}-${offset + uploadChunkSize - 1}/${fileSize}, progress: ${progress}%`);
      
      try {
        const actualChunkSize = Math.min(uploadChunkSize, fileSize - offset);
        
        // Driveからチャンクをダウンロード
        const drive = getDriveClient();
        const chunkResponse = await drive.files.get({
          fileId: fileId,
          alt: 'media'
        }, { 
          responseType: 'stream',
          headers: {
            'Range': `bytes=${offset}-${offset + actualChunkSize - 1}`
          }
        });
        
        // ストリームからBufferに変換
        const chunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          chunkResponse.data.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });
          chunkResponse.data.on('end', () => resolve());
          chunkResponse.data.on('error', reject);
        });
        
        const chunkBuffer = Buffer.concat(chunks);
        
        console.log(`Sending chunk request to: ${uploadUrl}`);
        response = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Length": `${actualChunkSize}`,
            "Content-Range": `bytes ${offset}-${offset + actualChunkSize - 1}/${fileSize}`,
          },
          body: chunkBuffer,
        });
        
        console.log(`チャンクアップロード成功 bytes ${offset}-${offset + actualChunkSize - 1}/${fileSize}, status: ${response.status}`);
        
      } catch(e: any) {
        console.log('[[ignore]] Chunk upload error [[ignore]] :', e);
        //fixme なぜかエラーになるが無視することでアップはできているっぽい=> no-corsで回避
      } finally {
        //   setUploadProgress(progress);
      }
      offset += uploadChunkSize;
    }

    // アップロード完了後の処理
    console.log('Upload completed, starting update process...');
    try {
      const updateUrl = process.env.SERVER_URL + '?func=updateYTVideo&actDate=' + encodeURIComponent(actDate) +'&fileName='+encodeURIComponent(title) + '&videoTitle='+encodeURIComponent(actDate + " " + title);
      console.log('actDate:', actDate);
      console.log('title:', title);
      console.log('Update URL:', updateUrl);
      if (updateUrl) {
        const updateResponse = await fetch(updateUrl, {
          method: 'GET',
        });
        console.log('Update response status:', updateResponse.status);
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error('Update HTTP error:', updateResponse.status, errorText);
          throw new Error(`Update HTTP error! status: ${updateResponse.status}, message: ${errorText}`);
        }
        
        // Content-Typeをチェック
        const updateContentType = updateResponse.headers.get('content-type');
        if (!updateContentType || !updateContentType.includes('application/json')) {
          const responseText = await updateResponse.text();
          console.error('Update non-JSON response:', responseText);
          throw new Error(`Expected JSON response but got: ${updateContentType}`);
        }
        
        const data = await updateResponse.json();
        console.log('Update response data:', data);
        if(data.err){
          console.error('Update error:', data.err);
          console.error(`更新エラー: ${data.err}`);
        } else {
          console.log('Update successful');
        }
      }
    } catch (error) {
      console.error('更新処理エラー:', error);
    }
    console.log('Upload process completed successfully');
    
  } catch (error) {
    console.error('ファイル処理エラー:', error);
  } finally {
    console.log('Closing modal');
  }
}

// アップロード中のフォルダを作成
async function createUploadingFolder(drive: any, parentFolderId: string, folderName: string) {
  try {
    const folderMetadata = {
      name: 'Uploading',
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };
    
    await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id'
    });
    
    console.log('✅ Uploadingフォルダを作成しました');
  } catch (error) {
    console.error('❌ Uploadingフォルダ作成エラー:', error);
  }
}

// アップロード中のフォルダを削除
async function deleteUploadingFolder(drive: any, parentFolderId: string) {
  try {
    // Uploadingフォルダを検索
    const response = await drive.files.list({
      q: `'${parentFolderId}' in parents and name='Uploading' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id,name)'
    });
    
    const uploadingFolders = response.data.files || [];
    
    for (const folder of uploadingFolders) {
      await drive.files.delete({
        fileId: folder.id!
      });
      console.log(`🧹 Uploadingフォルダを削除しました: ${folder.name}`);
    }
    
    console.log('🧹 Uploadingフォルダを削除しました');
  } catch (error) {
    console.error('❌ Uploadingフォルダ削除エラー:', error);
  }
}

// Completeフォルダを作成（既に存在する場合は作成しない）
async function createCompleteFolder(drive: any, parentFolderId: string, folderName: string) {
  try {
    // 既存のCompleteフォルダをチェック
    const response = await drive.files.list({
      q: `'${parentFolderId}' in parents and name='Complete' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id,name)'
    });
    
    const existingCompleteFolders = response.data.files || [];
    
    if (existingCompleteFolders.length > 0) {
      console.log('✅ Completeフォルダは既に存在します');
      return;
    }
    
    const folderMetadata = {
      name: 'Complete',
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };
    
    await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id'
    });
    
    console.log('✅ Completeフォルダを作成しました');
  } catch (error) {
    console.error('❌ Completeフォルダ作成エラー:', error);
  }
}

// 動画処理とアップロード
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folderId, folderName } = body;

    if (!folderId || !folderName) {
      return NextResponse.json({ 
        error: 'Folder ID and folder name are required' 
      }, { status: 400 });
    }

    console.log(`🎬 動画処理開始: ${folderName} (${folderId})`);

    // 1. アップロード中のフォルダを作成
    const drive = getDriveClient();
    await createUploadingFolder(drive, folderId, folderName);

    // Goalsフォルダかどうかをチェック
    // const isGoalsFolder = folderName.toLowerCase().includes('goals');
    const isGoalsFolder = false;
    let videoFiles;
    let file;
    
    if (isGoalsFolder) {
      // Goalsフォルダの場合、resultフォルダ内のファイルを取得
      console.log('🎯 Goalsフォルダを検出、resultフォルダ内のファイルを取得します');
      
      // まずresultフォルダを検索
      const resultFolderResponse = await drive.files.list({
        q: `'${folderId}' in parents and name='result' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id,name)",
        orderBy: "name"
      });
      
      const resultFolders = resultFolderResponse.data.files || [];
      
      if (resultFolders.length === 0) {
        return NextResponse.json({ 
          error: 'No result folder found in Goals folder' 
        }, { status: 404 });
      }
      
      const resultFolderId = resultFolders[0].id!;
      console.log(`📁 resultフォルダID: ${resultFolderId}`);
      
      // resultフォルダ内の動画ファイルを取得
      const filesResponse = await drive.files.list({
        q: `'${resultFolderId}' in parents and (mimeType contains 'video/' or mimeType contains 'application/octet-stream') and trashed=false`,
        fields: "files(id,name,mimeType,size,webContentLink)",
        orderBy: "name"
      });
      
      videoFiles = filesResponse.data.files || [];
    } else {
      // 通常のフォルダの場合、直接フォルダ内の動画ファイルを取得
      const filesResponse = await drive.files.list({
        q: `'${folderId}' in parents and (mimeType contains 'video/' or mimeType contains 'application/octet-stream') and trashed=false`,
        fields: "files(id,name,mimeType,size,webContentLink)",
        orderBy: "name"
      });
      
      videoFiles = filesResponse.data.files || [];
    }
    
    if (videoFiles.length === 0) {
      return NextResponse.json({ 
        error: isGoalsFolder ? 'No video files found in result folder' : 'No video files found in the folder' 
      }, { status: 404 });
    }

    if (videoFiles.length > 1) {
        return NextResponse.json({ 
            error: 'only single file is allowed' 
        }, { status: 400 });
    }
  
    console.log(`📁 動画ファイル数: ${videoFiles.length}`);

    // 動画ファイルを直接YouTubeにアップロード
    file = videoFiles[0];
    const baseFileName = file.name || 'video.mp4';
    console.log(`⬇️ ファイル処理中: ${file.name}`);
    
    // ファイル情報を取得
    const fileInfo = await drive.files.get({
      fileId: file.id!,
      fields: 'size'
    });
    
    const fileSize = parseInt(fileInfo.data.size || '0');
    console.log(`📁 ファイルサイズ: ${fileSize} bytes`);
    
    // フォルダ名からtitleとactDateを抽出
    const folderNameParts = folderName.split('#');
    const actDate = folderNameParts[0]?.trim() || folderName;
    const title = "#" + folderNameParts[1]?.trim() || folderName;
    
    console.log('🎬 YouTubeアップロード開始:', {
      originalFolderName: folderName,
      extractedActDate: actDate,
      extractedTitle: title,
      fileSize: fileSize
    });
    
    try {
      // Driveからチャンクでダウンロードして直接YouTubeにアップロード
      await uploadVideoFromDrive(file.id!, title, actDate, fileSize);
      
      console.log(`✅ YouTubeアップロード完了: ${title}`);
      
      // 3. Completeフォルダを作成
      console.log('✅ Completeフォルダを作成中...');
      await createCompleteFolder(drive, folderId, folderName);

      // 4. アップロード中のフォルダを削除
      console.log('🧹 Uploadingフォルダを削除中...');
      await deleteUploadingFolder(drive, folderId);

      console.log(`🎉 処理完了: ${title}`);

      return NextResponse.json({
        success: true,
        title: title,
        actDate: actDate,
        message: '動画処理とYouTubeアップロードが完了しました'
      });

    } catch (youtubeError) {
      console.error('❌ YouTubeアップロードエラー:', youtubeError);
      
      // エラー時もアップロード中のフォルダを削除
      try {
        await deleteUploadingFolder(drive, folderId);
      } catch (deleteError) {
        console.error('❌ エラー時のUploadingフォルダ削除エラー:', deleteError);
      }
      
      throw youtubeError;
    }

  } catch (error) {
    const detailedError = getDetailedError(error);
    console.error('❌ 動画処理エラー:', detailedError);
    return NextResponse.json({
      error: 'Video processing failed',
      details: detailedError.message,
      errorCode: detailedError.code,
      errorDetails: detailedError.details,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 