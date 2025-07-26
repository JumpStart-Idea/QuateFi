import React, { useState, useRef, useCallback } from 'react';
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
  Error,
  Add,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Dialog as MuiDialog } from '@mui/material';

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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('other');
  const fileInputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('onDrop called');
    console.log('Accepted files:', acceptedFiles);
    console.log('Rejected files:', rejectedFiles);
    
    // Handle too many files
    if (acceptedFiles.length > maxFiles) {
      setUploadErrors({ general: `You can only upload up to ${maxFiles} files at a time.` });
      setSelectedFiles([]);
      setUploadDialogOpen(false);
      return;
    }
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = {};
      rejectedFiles.forEach(({ file, errors: fileErrors }) => {
        errors[file.name] = fileErrors.map(error => {
          if (error.code === 'file-too-large') {
            return `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`;
          }
          if (error.code === 'file-invalid-type') {
            return 'Invalid file type';
          }
          return error.message;
        });
      });
      setUploadErrors(errors);
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      console.log('Setting selected files:', acceptedFiles);
      setSelectedFiles(acceptedFiles);
      setUploadDialogOpen(true);
    }
  }, [maxSize, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    maxFiles,
    noClick: false, // Ensure click events are handled
    noDrag: false,  // Ensure drag events are handled
  });

  // Add explicit click handler for better compatibility
  const handleUploadAreaClick = () => {
    console.log('Upload area clicked');
    console.log('File input ref:', fileInputRef.current);
    if (fileInputRef.current) {
      console.log('Triggering file input click');
      fileInputRef.current.click();
    } else {
      console.log('File input ref is null');
    }
  };

  // Fallback file input handler
  const handleFileInputChange = (event) => {
    console.log('Fallback file input change');
    const files = Array.from(event.target.files || []);
    console.log('Files selected via fallback:', files);
    
    if (files.length > maxFiles) {
      setUploadErrors({ general: `You can only upload up to ${maxFiles} files at a time.` });
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
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({});
    setUploadErrors({});

    try {
      const progressCallback = (fileName, progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [fileName]: progress
        }));
      };

      await onUpload(selectedFiles, uploadDescription, uploadCategory, progressCallback);
      
      // Show 100% completion briefly before hiding
      setUploadProgress(prev => {
        const completed = {};
        selectedFiles.forEach(file => {
          completed[file.name] = 100;
        });
        return completed;
      });
      
      // Wait a moment to show completion, then reset
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadDescription('');
        setUploadCategory('other');
        setUploadDialogOpen(false);
        setUploadProgress({}); // Clear progress bar
        setUploadErrors({}); // Clear any errors
      }, 1000); // 1 second delay
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadErrors({ general: error.message || 'Upload failed' });
      // Don't clear progress on error so user can see what happened
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await onDelete(fileId);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      if (onDownload) {
        await onDownload(fileId);
      } else {
        console.error('No download handler provided');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return <Image color="primary" />;
    if (mimeType === 'application/pdf') return <PictureAsPdf color="error" />;
    return <InsertDriveFile color="action" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box>
      {/* Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'primary.light' : 'background.paper',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.light',
            transform: 'scale(1.02)',
          },
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
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
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Maximum {maxFiles} files, {maxSize / (1024 * 1024)}MB each
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              handleUploadAreaClick();
            }}
          >
            Browse Files
          </Button>
        </Box>
      </Paper>

      {/* Upload Progress */}
      {uploadDialogOpen && Object.keys(uploadProgress).length > 0 && (
        <Box sx={{ mt: 2 }}>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <Box key={fileName} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{fileName}</Typography>
                <Typography variant="body2">{progress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          ))}
        </Box>
      )}

      {/* Upload Errors */}
      {Object.keys(uploadErrors).length > 0 && (
        <Box sx={{ mt: 2 }}>
          {Object.entries(uploadErrors).map(([fileName, errors]) => (
            <Alert key={fileName} severity="error" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">{fileName}:</Typography>
              {Array.isArray(errors) ? errors.join(', ') : errors}
            </Alert>
          ))}
        </Box>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files ({files.length})
          </Typography>
          <List>
            {files.map((file) => (
              <ListItem key={file._id || file.id} divider>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {getFileIcon(file.mimeType)}
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <ListItemText
                      primary={file.originalName}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatFileSize(file.fileSize)} • {formatDate(file.uploadDate)}
                          </Typography>
                          {file.description && (
                            <Typography variant="body2" color="text.secondary">
                              {file.description}
                            </Typography>
                          )}
                          {file.category && (
                            <Chip 
                              label={file.category} 
                              size="small" 
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </Box>
                </Box>
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
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
            ))}
          </List>
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selected Files ({selectedFiles.length}):
            </Typography>
            {selectedFiles.map((file, index) => (
              <Chip
                key={index}
                label={`${file.name} (${formatFileSize(file.size)})`}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          
          {showDescription && (
            <TextField
              fullWidth
              label="Description (optional)"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
          )}
          
          {showCategory && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={uploadCategory}
                label="Category"
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="legal">Legal</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            disabled={uploading}
            startIcon={uploading ? <LinearProgress size={16} /> : <Add />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <MuiDialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md">
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {previewFile && previewFile.filePath && (
            <img
              src={`http://localhost:9000/${previewFile.filePath}`}
              alt={previewFile.originalName}
              style={{ maxWidth: '100%', maxHeight: '60vh', display: 'block', margin: '0 auto' }}
            />
          )}
          {previewFile && !previewFile.filePath && (
            <Typography color="error">Preview not available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </MuiDialog>
    </Box>
  );
};

export default FileUpload; 