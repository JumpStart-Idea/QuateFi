import React, { useState, useRef, useCallback, useMemo } from 'react';  
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Download,
  Visibility,
  Description,
  Image,
  PictureAsPdf,
  InsertDriveFile,
  CheckCircle,
  Add,
  FileUpload as FileUploadIcon,
  Close,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ 
  onUpload, 
  onDelete, 
  onDownload,
  files = [], 
  maxFiles = 5, 
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  },
  title = "File Upload",
  description = "Drag and drop files here, or click to select files",
  showPreview = true,
  showDescription = true,
  showCategory = true,
}) => {
  // State management
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('other');
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  
  // Memoized values
  const fileSizeLimit = useMemo(() => maxSize / (1024 * 1024), [maxSize]);
  const isUploading = uploading || Object.keys(uploadProgress).length > 0;

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Clear previous errors
    setUploadErrors({});
    
    // Handle too many files
    if (acceptedFiles.length > maxFiles) {
      setUploadErrors({ 
        general: `You can only upload up to ${maxFiles} files at a time. Selected: ${acceptedFiles.length}` 
      });
      setSelectedFiles([]);
      setUploadDialogOpen(false);
      return;
    }
    
    // Handle rejected files with detailed error messages
    if (rejectedFiles.length > 0) {
      const errors = {};
      rejectedFiles.forEach(({ file, errors: fileErrors }) => {
        errors[file.name] = fileErrors.map(error => {
          switch (error.code) {
            case 'file-too-large':
              return `File too large. Maximum size is ${fileSizeLimit}MB`;
            case 'file-invalid-type':
              return 'Invalid file type. Please select a supported file format';
            case 'too-many-files':
              return 'Too many files selected';
            default:
              return error.message;
          }
        });
      });
      setUploadErrors(errors);
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      setSelectedFiles(acceptedFiles);
      setUploadDialogOpen(true);
    }
  }, [maxFiles, fileSizeLimit]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    maxFiles,
    noClick: false,
    noDrag: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDragOver: () => setDragActive(true),
    disabled: isUploading,
  });

  // Handle upload area click
  const handleUploadAreaClick = useCallback(() => {
    if (isUploading) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isUploading]);

  // Handle file input change
  const handleFileInputChange = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length > maxFiles) {
      setUploadErrors({ 
        general: `You can only upload up to ${maxFiles} files at a time. Selected: ${files.length}` 
      });
      setSelectedFiles([]);
      setUploadDialogOpen(false);
      event.target.value = '';
      return;
    }
    
    if (files.length > 0) {
      setSelectedFiles(files);
      setUploadDialogOpen(true);
    }
    
    // Reset the input
    event.target.value = '';
  }, [maxFiles]);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0 || isUploading) return;

    setUploading(true);
    setUploadProgress({});
    setUploadErrors({});

    try {
      const progressCallback = (fileName, progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [fileName]: Math.min(100, Math.max(0, progress))
        }));
      };

      await onUpload(selectedFiles, uploadDescription, uploadCategory, progressCallback);
      
      // Show completion state
      setUploadProgress(prev => {
        const completed = {};
        selectedFiles.forEach(file => {
          completed[file.name] = 100;
        });
        return completed;
      });
      
      // Reset form after successful upload
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadDescription('');
        setUploadCategory('other');
        setUploadDialogOpen(false);
        setUploadProgress({});
        setUploadErrors({});
      }, 1500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadErrors({ 
        general: error.message || 'Upload failed. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  }, [selectedFiles, uploadDescription, uploadCategory, onUpload, isUploading]);

  const handleDelete = useCallback(async (fileId) => {
    try {
      await onDelete(fileId);
    } catch (error) {
      console.error('Delete failed:', error);
      setUploadErrors({ 
        general: error.message || 'Failed to delete file. Please try again.' 
      });
    }
  }, [onDelete]);

  const handleDownload = useCallback(async (fileId) => {
    try {
      if (onDownload) {
        await onDownload(fileId);
      } else {
        console.error('No download handler provided');
        setUploadErrors({ 
          general: 'Download functionality not available' 
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      setUploadErrors({ 
        general: error.message || 'Failed to download file. Please try again.' 
      });
    }
  }, [onDownload]);

  const getFileIcon = useCallback((mimeType) => {
    if (mimeType.startsWith('image/')) return <Image color="primary" />;
    if (mimeType === 'application/pdf') return <PictureAsPdf color="error" />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <Description color="info" />;
    return <InsertDriveFile color="action" />;
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getFileTypeColor = useCallback((mimeType) => {
    if (mimeType.startsWith('image/')) return 'success';
    if (mimeType === 'application/pdf') return 'error';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'info';
    return 'default';
  }, []);

  return (
    <Box>
      {/* Upload Area */}
      <Fade in={true} timeout={500}>
        <Paper
          {...getRootProps()}
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            border: '2px dashed',
            borderColor: isDragActive || dragActive ? 'primary.main' : 'grey.300',
            backgroundColor: isDragActive || dragActive ? 'primary.light' : 'background.paper',
            opacity: isUploading ? 0.6 : 1,
            '&:hover': {
              borderColor: isUploading ? 'grey.300' : 'primary.main',
              backgroundColor: isUploading ? 'background.paper' : 'primary.light',
              transform: isUploading ? 'none' : 'scale(1.02)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }
          }}
          onClick={handleUploadAreaClick}
        >
          <input 
            {...getInputProps()} 
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Zoom in={true} timeout={300}>
              <Box>
                <CloudUpload 
                  sx={{ 
                    fontSize: 64, 
                    color: isUploading ? 'grey.400' : 'primary.main', 
                    mb: 2,
                    animation: isUploading ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 },
                    }
                  }} 
                />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {isUploading ? 'Uploading...' : title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {isUploading ? 'Please wait while files are being uploaded' : description}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Maximum {maxFiles} files, {fileSizeLimit}MB each
                </Typography>
                {!isUploading && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FileUploadIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadAreaClick();
                    }}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Browse Files
                  </Button>
                )}
              </Box>
            </Zoom>
          </Box>
        </Paper>
      </Fade>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Fade in={true} timeout={300}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Upload Progress
            </Typography>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <Box key={fileName} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, mr: 2 }}>
                    {fileName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      {progress}%
                    </Typography>
                    {progress === 100 && (
                      <CheckCircle color="success" sx={{ fontSize: 16 }} />
                    )}
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
            ))}
          </Box>
        </Fade>
      )}

      {/* Upload Errors */}
      {Object.keys(uploadErrors).length > 0 && (
        <Fade in={true} timeout={300}>
          <Box sx={{ mt: 2 }}>
            {Object.entries(uploadErrors).map(([fileName, errors]) => (
              <Alert 
                key={fileName} 
                severity="error" 
                sx={{ 
                  mb: 1,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
                action={
                  <IconButton
                    size="small"
                    onClick={() => setUploadErrors({})}
                    color="inherit"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                }
              >
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {fileName === 'general' ? 'Upload Error' : fileName}:
                </Typography>
                <Typography variant="body2">
                  {Array.isArray(errors) ? errors.join(', ') : errors}
                </Typography>
              </Alert>
            ))}
          </Box>
        </Fade>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Fade in={true} timeout={500}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 600 
            }}>
              <FileUploadIcon color="primary" />
              Uploaded Files ({files.length})
            </Typography>
            <List sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}>
              {files.map((file, index) => (
                <Fade in={true} timeout={300} key={file._id || file.id} style={{ transitionDelay: `${index * 100}ms` }}>
                  <ListItem 
                    divider={index < files.length - 1}
                    sx={{ 
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      transition: 'background-color 0.2s ease-in-out'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${getFileTypeColor(file.mimeType)}.light`,
                          color: `${getFileTypeColor(file.mimeType)}.contrastText`,
                          mr: 2,
                          width: 40,
                          height: 40
                        }}
                      >
                        {getFileIcon(file.mimeType)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {file.originalName}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {formatFileSize(file.fileSize)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">•</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(file.uploadDate)}
                                </Typography>
                              </Box>
                              {file.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  {file.description}
                                </Typography>
                              )}
                              {file.category && (
                                <Chip 
                                  label={file.category} 
                                  size="small" 
                                  color={getFileTypeColor(file.mimeType)}
                                  sx={{ 
                                    textTransform: 'capitalize',
                                    fontWeight: 500
                                  }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {showPreview && (
                          <Tooltip title={file.mimeType.startsWith('image/') ? "Preview" : "Preview not available"}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={!file.mimeType.startsWith('image/')}
                                onClick={() => {
                                  if (file.mimeType.startsWith('image/')) {
                                    setPreviewFile(file);
                                    setPreviewOpen(true);
                                  }
                                }}
                                sx={{ 
                                  color: file.mimeType.startsWith('image/') ? 'primary.main' : 'grey.400'
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                        <Tooltip title="Download">
                          <IconButton 
                            size="small"
                            onClick={() => handleDownload(file._id || file.id)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(file._id || file.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Fade>
              ))}
            </List>
          </Box>
        </Fade>
      )}

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => !isUploading && setUploadDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          pb: 1 
        }}>
          <CloudUpload color="primary" />
          Upload Files
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Selected Files ({selectedFiles.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedFiles.map((file, index) => (
                <Chip
                  key={index}
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  color="primary"
                  variant="outlined"
                  sx={{ 
                    maxWidth: '100%',
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {showDescription && (
            <TextField
              fullWidth
              label="Description (optional)"
              placeholder="Add a description for these files..."
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 3 }}
              disabled={isUploading}
            />
          )}
          
          {showCategory && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={uploadCategory}
                label="Category"
                onChange={(e) => setUploadCategory(e.target.value)}
                disabled={isUploading}
              >
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="legal">Legal</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setUploadDialogOpen(false)} 
            disabled={isUploading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            disabled={isUploading}
            startIcon={isUploading ? undefined : <Add />}
            sx={{ 
              textTransform: 'none',
              minWidth: 120,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
            {isUploading && (
              <LinearProgress 
                sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2
                }} 
              />
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          pb: 1 
        }}>
          <Visibility color="primary" />
          Image Preview
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {previewFile && previewFile.filePath ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 400,
              bgcolor: 'grey.50'
            }}>
              <img
                src={`http://localhost:9000/${previewFile.filePath}`}
                alt={previewFile.originalName}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  display: 'block',
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <Typography 
                color="error" 
                sx={{ 
                  display: 'none',
                  textAlign: 'center',
                  p: 3
                }}
              >
                Preview not available
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 200,
              bgcolor: 'grey.50'
            }}>
              <Typography color="error" variant="h6">
                Preview not available
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setPreviewOpen(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload; 