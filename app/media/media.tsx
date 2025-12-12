'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ExifData {
  dateTimeOriginal?: string;
  photographer?: string;
  camera?: string;
  model?: string;
  location?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  exposureTime?: string;
  fNumber?: string;
  isoSpeed?: string;
  focalLength?: string;
  flashUsed?: boolean;
  meteringMode?: string;
  sensor?: string;
  colorSpace?: string;
  whiteBalance?: string;
  exposureMode?: string;
  durationMillis?: string;
  fps?: number;
}

interface MediaFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl: string;
  webViewLink: string;
  directUrl?: string;
  createdTime: string;
  modifiedTime: string;
  size: string;
  width: number;
  height: number;
  isImage: boolean;
  isVideo: boolean;
  isFolder?: boolean;
  exif?: ExifData;
}

interface FolderPath {
  id: string;
  name: string;
}

export default function Media() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showExifInfo, setShowExifInfo] = useState<boolean>(false);
  const [defaultFolderId, setDefaultFolderId] = useState<string>('');
  const [currentFolderId, setCurrentFolderId] = useState<string>('');
  const [folderPath, setFolderPath] = useState<FolderPath[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    // 設定ファイルからbvs_folder_idを取得
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          const project_config = data.project_config;
          if (project_config?.bvs_folder_id) {
            const folderIdValue = project_config.bvs_folder_id;
            setDefaultFolderId(folderIdValue);
            setCurrentFolderId(folderIdValue);
            // 設定ファイルから取得したフォルダIDでメディアファイルを取得
            fetchMediaFiles(folderIdValue);
            return;
          }
        }
        // 設定ファイルにフォルダIDがない場合は、デフォルトで取得を試みる
        fetchMediaFiles();
      } catch (error) {
        console.error('設定ファイル読み込みエラー:', error);
        // エラーが発生した場合も、デフォルトで取得を試みる
        fetchMediaFiles();
      }
    };
    
    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchMediaFiles = async (targetFolderId?: string, folderName?: string, isBackNavigation: boolean = false) => {
    try {
      setIsLoading(true);
      // 優先順位: targetFolderId > currentFolderId > defaultFolderId
      const folder = targetFolderId || currentFolderId || defaultFolderId || '';
      const url = `/api/media${folder ? `?folderId=${folder}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch media files');
      }
      
      const data = await response.json();
      setFiles(data.files || []);
      
      // フォルダIDを更新
      if (targetFolderId) {
        setCurrentFolderId(targetFolderId);
        
        // パスを更新（ルートより上には行かない）
        if (targetFolderId === defaultFolderId) {
          // ルートに戻った場合
          setFolderPath([]);
        } else if (isBackNavigation) {
          // 戻る操作の場合はパスを更新しない（handleBackClickで処理）
        } else if (folderName) {
          // 新しいフォルダに入った場合（パスに追加）
          setFolderPath(prev => {
            // 既に同じフォルダがパスにある場合は追加しない
            if (prev.some(p => p.id === targetFolderId)) {
              return prev;
            }
            return [...prev, { id: targetFolderId, name: folderName }];
          });
        }
      }
    } catch (error) {
      console.error('メディアファイル取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderClick = (folder: MediaFile) => {
    if (folder.isFolder) {
      fetchMediaFiles(folder.id, folder.name, false);
    }
  };

  const handleBackClick = (index: number) => {
    // 指定されたインデックスまで戻る
    if (index === -1) {
      // ルートに戻る
      setFolderPath([]);
      fetchMediaFiles(defaultFolderId, undefined, true);
    } else {
      const targetPath = folderPath[index];
      // パスを切り詰める
      setFolderPath(prev => prev.slice(0, index + 1));
      fetchMediaFiles(targetPath.id, targetPath.name, true);
    }
  };

  const handleFileClick = (file: MediaFile) => {
    // フォルダの場合はナビゲーション、ファイルの場合は詳細表示
    if (file.isFolder) {
      handleFolderClick(file);
    } else {
      setSelectedFile(file);
      setShowExifInfo(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedFile(null);
    setShowExifInfo(false);
  };

  const formatFileSize = (bytes: string): string => {
    const size = parseInt(bytes, 10);
    if (size === 0) return '不明';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && files.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">思い出</h1>
          <p className="text-gray-600 mb-6">
            Google Driveから写真と動画を表示します（アップロードはGoogle Driveアプリからお願いします）
          </p>

          {/* リフレッシュボタン */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => fetchMediaFiles()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              更新
            </button>
          </div>

          {/* パンくずリスト */}
          {folderPath.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button
                onClick={() => handleBackClick(-1)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                ルート
              </button>
              {folderPath.map((path, index) => (
                <div key={path.id} className="flex items-center gap-2">
                  <span className="text-gray-400">/</span>
                  <button
                    onClick={() => handleBackClick(index)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    {path.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 統計情報 */}
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              フォルダ: {files.filter(f => f.isFolder).length}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              写真: {files.filter(f => f.isImage).length}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              動画: {files.filter(f => f.isVideo).length}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              合計: {files.length}件
            </span>
          </div>
        </div>

        {/* メディアグリッド */}
        {files.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              メディアファイルが見つかりませんでした
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg bg-gray-200 hover:shadow-lg transition-shadow"
              >
                {file.isFolder ? (
                  // フォルダの表示
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-200 p-4">
                    <svg
                      className="h-16 w-16 text-yellow-600 mb-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                    </svg>
                    <p className="text-xs text-gray-700 font-medium text-center line-clamp-2 break-words">
                      {file.name}
                    </p>
                  </div>
                ) : file.thumbnailUrl ? (
                  // 画像・動画のサムネイル表示
                  <img
                    src={file.thumbnailUrl}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // 画像読み込みエラー時は非表示にしてプレースホルダーを表示
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.classList.add('bg-gray-200');
                    }}
                  />
                ) : (
                  // サムネイルがない場合のフォールバック
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    {file.isVideo ? (
                      <svg
                        className="h-12 w-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                )}
                {/* ファイルタイプバッジ */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded p-1">
                  {file.isFolder ? (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                    </svg>
                  ) : file.isVideo ? (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleCloseDialog}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタンとiマーク */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {/* iマーク（情報ボタン） */}
              {!selectedFile.isFolder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExifInfo(!showExifInfo);
                  }}
                  className="bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-colors"
                  title="情報を表示"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}
              {/* 閉じるボタン */}
              <button
                onClick={handleCloseDialog}
                className="bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* メディア表示 */}
            {!selectedFile.isFolder && (
              <div className="relative bg-black">
                {selectedFile.isImage ? (
                  <img
                    src={selectedFile.thumbnailUrl || selectedFile.webViewLink}
                    alt={selectedFile.name}
                    className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  />
                ) : (
                  <div className="w-full bg-black flex items-center justify-center">
                    <video
                      src={selectedFile.webViewLink}
                      controls
                      className="w-full h-auto max-h-[70vh]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* EXIF情報パネル */}
            {showExifInfo && selectedFile.exif && (
              <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm z-20 max-h-[70vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-3">EXIF情報</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedFile.exif.dateTimeOriginal && (
                    <div>
                      <span className="font-semibold">撮影日時:</span>{' '}
                      {formatDate(selectedFile.exif.dateTimeOriginal)}
                    </div>
                  )}
                  {selectedFile.exif.photographer && (
                    <div>
                      <span className="font-semibold">撮影者:</span>{' '}
                      {selectedFile.exif.photographer}
                    </div>
                  )}
                  {selectedFile.exif.camera && (
                    <div>
                      <span className="font-semibold">カメラメーカー:</span>{' '}
                      {selectedFile.exif.camera}
                    </div>
                  )}
                  {selectedFile.exif.model && (
                    <div>
                      <span className="font-semibold">カメラモデル:</span>{' '}
                      {selectedFile.exif.model}
                    </div>
                  )}
                  {selectedFile.exif.exposureTime && (
                    <div>
                      <span className="font-semibold">シャッタースピード:</span>{' '}
                      {selectedFile.exif.exposureTime}秒
                    </div>
                  )}
                  {selectedFile.exif.fNumber && (
                    <div>
                      <span className="font-semibold">F値:</span>{' '}
                      f/{selectedFile.exif.fNumber}
                    </div>
                  )}
                  {selectedFile.exif.isoSpeed && (
                    <div>
                      <span className="font-semibold">ISO感度:</span>{' '}
                      {selectedFile.exif.isoSpeed}
                    </div>
                  )}
                  {selectedFile.exif.focalLength && (
                    <div>
                      <span className="font-semibold">焦点距離:</span>{' '}
                      {selectedFile.exif.focalLength}mm
                    </div>
                  )}
                  {selectedFile.exif.flashUsed !== undefined && (
                    <div>
                      <span className="font-semibold">フラッシュ:</span>{' '}
                      {selectedFile.exif.flashUsed ? '使用' : '未使用'}
                    </div>
                  )}
                  {selectedFile.exif.meteringMode && (
                    <div>
                      <span className="font-semibold">測光モード:</span>{' '}
                      {selectedFile.exif.meteringMode}
                    </div>
                  )}
                  {selectedFile.exif.colorSpace && (
                    <div>
                      <span className="font-semibold">色空間:</span>{' '}
                      {selectedFile.exif.colorSpace}
                    </div>
                  )}
                  {selectedFile.exif.whiteBalance && (
                    <div>
                      <span className="font-semibold">ホワイトバランス:</span>{' '}
                      {selectedFile.exif.whiteBalance}
                    </div>
                  )}
                  {selectedFile.exif.exposureMode && (
                    <div>
                      <span className="font-semibold">露出モード:</span>{' '}
                      {selectedFile.exif.exposureMode}
                    </div>
                  )}
                  {selectedFile.exif.durationMillis && (
                    <div>
                      <span className="font-semibold">動画の長さ:</span>{' '}
                      {Math.round(parseInt(selectedFile.exif.durationMillis) / 1000)}秒
                    </div>
                  )}
                  {selectedFile.exif.fps && selectedFile.exif.fps > 0 && (
                    <div>
                      <span className="font-semibold">フレームレート:</span>{' '}
                      {selectedFile.exif.fps} fps
                    </div>
                  )}
                  {selectedFile.exif.location && (
                    <div>
                      <span className="font-semibold">位置情報:</span>
                      <div className="ml-4 mt-1">
                        <div>緯度: {selectedFile.exif.location.latitude}</div>
                        <div>経度: {selectedFile.exif.location.longitude}</div>
                        {selectedFile.exif.location.altitude > 0 && (
                          <div>標高: {selectedFile.exif.location.altitude}m</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ファイル情報 */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedFile.name}
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">種類:</span>{' '}
                  {selectedFile.isFolder ? 'フォルダ' : selectedFile.isImage ? '写真' : '動画'}
                </div>
                <div>
                  <span className="font-semibold">サイズ:</span>{' '}
                  {formatFileSize(selectedFile.size)}
                </div>
                {selectedFile.width > 0 && selectedFile.height > 0 && (
                  <div>
                    <span className="font-semibold">解像度:</span>{' '}
                    {selectedFile.width} × {selectedFile.height}
                  </div>
                )}
                <div>
                  <span className="font-semibold">更新日時:</span>{' '}
                  {formatDate(selectedFile.modifiedTime)}
                </div>
                <div>
                  <span className="font-semibold">作成日時:</span>{' '}
                  {formatDate(selectedFile.createdTime)}
                </div>
                <div className="pt-4">
                  <a
                    href={selectedFile.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Google Driveで開く
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

