'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Chip,
    Alert,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress
} from '@mui/material';
import { 
    Upload, 
    Folder, 
    Refresh,
    PlayArrow,
    YouTube
} from '@mui/icons-material';
import LoadingSpinner from './loadingSpinner';

interface DriveFolder {
    id: string;
    name: string;
    createdTime: string;
    modifiedTime: string;
    webViewLink: string;
    size?: string;
    fileCount?: number;
    fileNames?: string[];
    subFolderNames?: string[];
    hasResultFolder?: boolean;
    hasCompleteFolder?: boolean;
    hasUploadingFolder?: boolean;
}

// エラーバウンダリコンポーネント
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            エラーが発生しました
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {this.state.error?.message}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            ページを再読み込み
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default function VideoEdit() {
    const [folders, setFolders] = useState<DriveFolder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        tags: '',
        categoryId: '22',
        privacyStatus: 'private'
    });
    const [processingFolders, setProcessingFolders] = useState<Set<string>>(new Set());

    // タスクの種類定義
    const taskTypes = [
        { value: 'upload', label: 'YouTubeアップロード', icon: <Upload />, color: '#d32f2f' }
    ];

    // Goalsフォルダ用のタスク定義
    const goalsTaskTypes = [
        { value: 'imageMerge', label: '画像ラスト１０秒合体', icon: <YouTube />, color: '#1976d2' },
        { value: 'upload', label: 'YouTubeアップロード', icon: <Upload />, color: '#d32f2f' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log('📁 Google Drive API でフォルダ一覧を取得中...');
            
            const response = await fetch('/api/drive?action=folders');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('data', data);
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            console.log('✅ フォルダ一覧取得完了:', data.folders?.length || 0, '個のフォルダ');
            setFolders(data.folders || []);
        } catch (error) {
            console.error('❌ データ取得エラー:', error);
            setError(error instanceof Error ? error.message : 'データ取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoUpload = async () => {
        if (!selectedVideoFile) {
            alert('動画ファイルを選択してください。');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append('video', selectedVideoFile);
            formData.append('title', uploadForm.title);
            formData.append('description', uploadForm.description);
            formData.append('tags', uploadForm.tags);
            formData.append('categoryId', uploadForm.categoryId);
            formData.append('privacyStatus', uploadForm.privacyStatus);

            // アップロード進捗をシミュレート
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 1000);

            const response = await fetch('/api/youtube/upload', {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();

            if (result.success) {
                alert(`動画のアップロードが完了しました！\n動画URL: ${result.videoUrl}`);
                setUploadDialogOpen(false);
                setSelectedVideoFile(null);
                setUploadForm({
                    title: '',
                    description: '',
                    tags: '',
                    categoryId: '22',
                    privacyStatus: 'private'
                });
            } else {
                throw new Error(result.error || 'アップロードに失敗しました');
            }

        } catch (error) {
            console.error('❌ 動画アップロードエラー:', error);
            alert(`動画アップロードに失敗しました: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedVideoFile(file);
            setUploadForm(prev => ({
                ...prev,
                title: file.name.replace(/\.[^/.]+$/, '') // 拡張子を除いたファイル名
            }));
        }
    };

    const truncateFileName = (fileName: string, maxLength: number = 30) => {
        if (fileName.length <= maxLength) {
            return fileName;
        }
        const extension = fileName.split('.').pop();
        const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const truncatedName = nameWithoutExtension.substring(0, maxLength - extension!.length - 4) + '...';
        return `${truncatedName}.${extension}`;
    };

    const truncateFolderName = (folderName: string, maxLength: number = 40) => {
        if (folderName.length <= maxLength) {
            return folderName;
        }
        return folderName.substring(0, maxLength - 3) + '...';
    };

    const handleTaskExecution = async (folderId: string, taskType: string, folderName: string) => {
        console.log(`実行: ${taskType} for folder: ${folderName} (${folderId})`);
        
        if (taskType === 'imageMerge') {
            // 画像ラスト１０秒合体の場合はColabを開く
            window.open('https://colab.research.google.com/drive/1eV1-ik9TYcRkL98-gP1pjn8OExgofkQp#scrollTo=_K2jocipier3', '_blank');
            return;
        }
        
        if (taskType === 'upload') {
            // フォルダ情報を取得
            const folder = folders.find(f => f.id === folderId);
            if (!folder) {
                alert('フォルダ情報が見つかりません。');
                return;
            }



            setProcessingFolders(prev => new Set([...prev, folderId]));
            
            try {
                setUploading(true);
                setUploadProgress(0);

                // Uploadingフォルダの存在を確認
                const checkResponse = await fetch('/api/drive?action=checkUploading&folderId=' + folderId);
                if (!checkResponse.ok) {
                    throw new Error(`Uploadingフォルダ確認エラー: ${checkResponse.status}`);
                }
                
                const checkResult = await checkResponse.json();
                if (checkResult.hasUploadingFolder) {
                    alert('このフォルダは既にアップロード中です。処理を中止します。');
                    return;
                }

                // 進捗をシミュレート
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return prev;
                        }
                        return prev + 5;
                    });
                }, 500);

                // 動画処理とアップロードを実行
                const response = await fetch('/api/video/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        folderId: folderId,
                        folderName: folderName
                    })
                });

                clearInterval(progressInterval);
                setUploadProgress(100);

                // レスポンスステータスをチェック
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                let result;
                let responseText = '';
                
                try {
                    result = await response.json();
                } catch (jsonError) {
                    // JSONパースエラーの場合、元のレスポンスボディを取得
                    // レスポンスボディは一度しか読み取れないので、先にテキストとして取得
                    responseText = await response.text();
                    console.error('JSONパースエラー:', jsonError);
                    console.error('レスポンスボディ:', responseText);
                    
                    // レスポンスボディをJSONとして再パースを試行
                    try {
                        result = JSON.parse(responseText);
                    } catch (parseError) {
                        throw new Error(`JSONパースエラー: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}\n\nレスポンスボディ:\n${responseText}`);
                    }
                }

                if (result.success) {
                    const processType = '動画アップロード';
                    
                    alert(`動画アップロードが完了しました！\n\n処理内容: ${processType}\nタイトル: ${result.title}\n日付: ${result.actDate}\n\nCompleteフォルダが作成されました。`);
                    
                    // データを再取得
                    await fetchData();
                } else {
                    if (result.error && result.error.includes('only single file is allowed')) {
                        alert(`エラー: 複数のファイルが検出されました。\n\n1つのファイルのみ処理可能です。`);
                    } else {
                        // 詳細なエラー情報がある場合は表示
                        let errorMessage = result.error || '処理に失敗しました';
                        if (result.details) {
                            errorMessage += `\n\n詳細: ${result.details}`;
                        }
                        if (result.errorCode) {
                            errorMessage += `\n\nエラーコード: ${result.errorCode}`;
                        }
                        if (result.errorDetails) {
                            errorMessage += `\n\nエラー詳細: ${JSON.stringify(result.errorDetails, null, 2)}`;
                        }
                        throw new Error(errorMessage);
                    }
                }

            } catch (error: unknown) {
                console.error('❌ 動画処理エラー:', error);
                // リロードによる処理中断の場合はアラートを表示しない
                const errorMessage = error instanceof Error ? error.message : String(error);
                if (!errorMessage.includes('fetch')) {
                    alert(`動画処理に失敗しました: ${errorMessage}`);
                }
                         } finally {
                 setUploading(false);
                 setUploadProgress(0);
                 setProcessingFolders(prev => {
                     const newSet = new Set(prev);
                     newSet.delete(folderId);
                     return newSet;
                 });
             }
        }
    };

    const getTaskDisplayName = (taskType: string) => {
        switch (taskType) {
            case 'upload': return 'YouTubeアップロード';
            case 'imageMerge': return '画像ラスト１０秒合体';
            default: return '動画処理';
        }
    };

    const refreshData = async () => {
        await fetchData();
    };

    return (
        <ErrorBoundary>
            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        エラーが発生しました
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={fetchData}
                        sx={{ mt: 2 }}
                    >
                        再試行
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: 'column', p: 2 }}>
                    <Typography variant="h4" component="div" sx={{ textAlign: 'center', color: '#3f51b5', mb: 3 }}>
                        動画編集管理
                    </Typography>

                {/* コントロール */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#757575' }}>
                        Driveフォルダ一覧
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={refreshData}
                        size="small"
                    >
                        更新
                    </Button>
                </Box>

                {/* フォルダ一覧 */}
                                 {folders.map((folder) => {
                     const isProcessing = processingFolders.has(folder.id);
                    
                    return (
                        <Paper key={folder.id} elevation={2} sx={{ mb: 2 }}>
                            <Box sx={{ p: 2 }}>
                                {/* フォルダ情報 */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1, minWidth: 0 }}>
                                        <Folder sx={{ color: '#1976d2', mt: 0.5, flexShrink: 0 }} />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Tooltip title={folder.name} arrow>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, wordBreak: 'break-word' }}>
                                                    {truncateFolderName(folder.name)}
                                                </Typography>
                                            </Tooltip>
                                            <Typography variant="body2" sx={{ color: '#757575', mb: 1 }}>
                                                ファイル数: {folder.fileCount || 0}
                                            </Typography>
                                            
                                            {/* ステータスバッジ */}
                                            {(folder.hasResultFolder || folder.hasCompleteFolder || folder.hasUploadingFolder) && (
                                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                    {folder.hasUploadingFolder && (
                                                        <Chip
                                                            label="アップロード中"
                                                            size="small"
                                                            color="warning"
                                                            variant="filled"
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                    {folder.hasResultFolder && (
                                                        <Chip
                                                            label="ビデオ処理済み"
                                                            size="small"
                                                            color="success"
                                                            variant="filled"
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                    {folder.hasCompleteFolder && (
                                                        <Chip
                                                            label="アップロード済み"
                                                            size="small"
                                                            color="error"
                                                            variant="filled"
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                            {/* ファイル一覧 */}
                                            {folder.fileNames && folder.fileNames.length > 0 ? (
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="caption" sx={{ color: '#757575', fontWeight: 'bold' }}>
                                                        ファイル一覧:
                                                    </Typography>
                                                    <Box sx={{ mt: 0.5 }}>
                                                        {folder.fileNames.map((fileName, index) => (
                                                            <Tooltip key={index} title={fileName} arrow>
                                                                <Chip
                                                                    label={truncateFileName(fileName)}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ 
                                                                        mr: 0.5, 
                                                                        mb: 0.5, 
                                                                        fontSize: '0.75rem',
                                                                        backgroundColor: '#f5f5f5',
                                                                        maxWidth: '300px'
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Alert severity="warning" sx={{ mt: 1, maxWidth: 400 }}>
                                                    このフォルダにはファイルがありません
                                                </Alert>
                                            )}
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        href={folder.webViewLink}
                                        target="_blank"
                                        startIcon={<PlayArrow />}
                                        sx={{ 
                                            flexShrink: 0,
                                            minWidth: 'auto',
                                            fontSize: '0.75rem',
                                            px: 1,
                                            py: 0.5
                                        }}
                                    >
                                        Drive
                                    </Button>
                                </Box>

                                {/* タスクボタン */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#757575', mb: 1 }}>
                                        実行可能なタスク
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', maxWidth: '100%' }}>
                                        {/* フォルダ名にGoalsが含まれているかチェック */}
                                        {(folder.name.toLowerCase().includes('goals') ? goalsTaskTypes : taskTypes).map((taskType) => {
                                                                                         // 複数ファイルがある場合は無効化
                                             const hasMultipleFiles = Boolean(folder.fileCount && folder.fileCount > 1);
                                             const hasNoFiles = Boolean(folder.fileCount === 0);
                                             const isUploading = folder.hasUploadingFolder;
                                             const isProcessing = processingFolders.has(folder.id);
                                             const isDisabled = hasMultipleFiles || hasNoFiles || isUploading || isProcessing;
                                                                                        
                                            return (
                                                <Tooltip
                                                    key={taskType.value}
                                                                                                         title={
                                                         isDisabled
                                                             ? (hasMultipleFiles ? '複数ファイルがあります。1つのファイルのみ処理可能です。' : 
                                                                 hasNoFiles ? 'ファイルがありません。' :
                                                                 isUploading ? 'アップロード中です。' : '処理中です。')
                                                             : (taskType.value === 'imageMerge' ? 
                                                                 (hasNoFiles ? 'ファイルがありません。' : '画像ラスト１０秒合体ツールを開く') : 
                                                                 '動画をアップロード')
                                                     }
                                                    arrow
                                                >
                                                    <span>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={taskType.icon}
                                                                                                                         disabled={taskType.value === 'imageMerge' ? hasNoFiles : (hasMultipleFiles || hasNoFiles || isUploading || isProcessing)}
                                                            onClick={() => handleTaskExecution(folder.id, taskType.value, folder.name)}
                                                                                                                         sx={{ 
                                                                 backgroundColor: (taskType.value === 'imageMerge' ? hasNoFiles : isDisabled) ? '#ccc' : taskType.color,
                                                                 fontSize: '0.75rem',
                                                                 px: 1.5,
                                                                 py: 0.5,
                                                                 minWidth: 'auto',
                                                                 color: 'white',
                                                                 '&:hover': {
                                                                     backgroundColor: (taskType.value === 'imageMerge' ? hasNoFiles : isDisabled) ? '#ccc' : taskType.color,
                                                                     opacity: (taskType.value === 'imageMerge' ? hasNoFiles : isDisabled) ? 1 : 0.8
                                                                 },
                                                                 '&:disabled': {
                                                                     backgroundColor: '#ccc',
                                                                     color: '#666'
                                                                 }
                                                             }}
                                                        >
                                                            {getTaskDisplayName(taskType.value)}
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            );
                                        })}
                                    </Box>
                                </Box>

                                {/* 処理進捗 */}
                                {isProcessing && (
                                    <Box sx={{ width: '100%', mt: 2 }}>
                                        <LinearProgress variant="determinate" value={uploadProgress} />
                                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                            動画処理中... {uploadProgress}%
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    );
                })}

                {folders.length === 0 && (
                    <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: '#757575' }}>
                            フォルダが見つかりません
                        </Typography>
                    </Paper>
                )}

                {/* YouTubeアップロードダイアログ */}
                <Dialog 
                    open={uploadDialogOpen} 
                    onClose={() => setUploadDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>YouTube動画アップロード</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            {/* ファイル選択 */}
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<Upload />}
                            >
                                動画ファイルを選択
                                <input
                                    type="file"
                                    hidden
                                    accept="video/*"
                                    onChange={handleFileSelect}
                                />
                            </Button>
                            
                            {selectedVideoFile && (
                                <Typography variant="body2" color="text.secondary">
                                    選択されたファイル: {selectedVideoFile.name}
                                </Typography>
                            )}

                            {/* タイトル */}
                            <TextField
                                label="動画タイトル"
                                value={uploadForm.title}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                fullWidth
                            />

                            {/* 説明 */}
                            <TextField
                                label="動画の説明"
                                value={uploadForm.description}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                multiline
                                rows={3}
                                fullWidth
                            />

                            {/* タグ */}
                            <TextField
                                label="タグ（カンマ区切り）"
                                value={uploadForm.tags}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                                fullWidth
                                helperText="例: サッカー,ゴール,ハイライト"
                            />

                            {/* カテゴリ */}
                            <FormControl fullWidth>
                                <InputLabel>カテゴリ</InputLabel>
                                <Select
                                    value={uploadForm.categoryId}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, categoryId: e.target.value }))}
                                    label="カテゴリ"
                                >
                                    <MenuItem value="22">People & Blogs</MenuItem>
                                    <MenuItem value="17">Sports</MenuItem>
                                    <MenuItem value="10">Music</MenuItem>
                                    <MenuItem value="1">Film & Animation</MenuItem>
                                    <MenuItem value="20">Gaming</MenuItem>
                                </Select>
                            </FormControl>

                            {/* プライバシー設定 */}
                            <FormControl fullWidth>
                                <InputLabel>プライバシー設定</InputLabel>
                                <Select
                                    value={uploadForm.privacyStatus}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, privacyStatus: e.target.value }))}
                                    label="プライバシー設定"
                                >
                                    <MenuItem value="private">非公開</MenuItem>
                                    <MenuItem value="unlisted">限定公開</MenuItem>
                                    <MenuItem value="public">公開</MenuItem>
                                </Select>
                            </FormControl>

                            {/* アップロード進捗 */}
                            {uploading && (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress variant="determinate" value={uploadProgress} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        アップロード中... {uploadProgress}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
                            キャンセル
                        </Button>
                        <Button 
                            onClick={handleVideoUpload} 
                            variant="contained" 
                            disabled={!selectedVideoFile || uploading}
                            startIcon={<YouTube />}
                        >
                            {uploading ? 'アップロード中...' : 'アップロード'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            )}
        </ErrorBoundary>
    );
} 