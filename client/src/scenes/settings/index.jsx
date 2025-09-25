import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormGroup,
  Radio,
  RadioGroup,
  FormLabel,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
  ListItemSecondaryAction,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FileUpload from "components/FileUpload";
import {
  Save,
  Refresh,
  Notifications,
  Security,
  Palette,
  Language,
  Storage,
  CloudUpload,
  Info,
  ExpandMore,
  Email,
  Phone,
  Visibility,
  VisibilityOff,
  Lock,
  Speed,
  DataUsage,
  Backup,
  Sync,
  NotificationsActive,
  NotificationsOff,

  Accessibility,
  VolumeUp,
  VolumeOff,
  AutoAwesome,
  Business,
  Person,
  Dashboard,
  Analytics,
  PrivacyTip,
  StorageOutlined,
  CloudDone,
  CloudOff,
  Schedule,
  Timer,
  FormatSize,
  Contrast,
  ZoomIn,
  ZoomOut,
  Warning,
  EditOutlined,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { 
  useGetUserSettingsQuery, 
  useUpdateUserSettingsMutation, 
  useResetUserSettingsMutation,
  useUpdateSettingsFieldMutation,
  useUploadProfilePictureMutation,
  useUploadDocumentsMutation,
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  useDownloadDocumentQuery
} from "state/api";
import settingsService from "services/settingsService";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
];

const timezones = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+10:00",
  "UTC+11:00",
  "UTC+12:00",
];

const Settings = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.global.user);
  const [activeTab, setActiveTab] = useState(0);

  // API hooks - only make API calls if we have a valid user ID
  const { data: settingsData, isLoading, error } = useGetUserSettingsQuery(
    user?.id || user?._id, 
    { skip: !user?.id && !user?._id }
  );
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();
  const [resetSettings, { isLoading: isResetting }] = useResetUserSettingsMutation();
  const [updateField] = useUpdateSettingsFieldMutation();
  
  // File upload hooks
  const [uploadProfilePicture] = useUploadProfilePictureMutation();
  const [uploadDocuments] = useUploadDocumentsMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const { data: documentsData, isLoading: documentsLoading } = useGetDocumentsQuery(
    user?.id || user?._id,
    { skip: !user?.id && !user?._id }
  );

  // Default settings object
  const defaultSettings = {
    // Profile Settings
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    jobTitle: "Senior Manager",
    department: "Sales",
    avatar: "",
    profilePicture: "",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: true,
    securityAlerts: true,
    orderUpdates: true,
    priceAlerts: false,
    newsletter: false,
    notificationVolume: 70,
    quietHours: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    
    // Display & Appearance
    compactMode: false,
    showAnimations: true,
    autoRefresh: true,
    refreshInterval: 30,
    fontSize: "medium",
    contrast: "normal",
    zoomLevel: 100,
    showGridLines: true,
    showTooltips: true,
    autoSave: true,
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: 60,
    dataRetention: 365,
    analyticsTracking: true,
    crashReporting: false,
    locationSharing: false,
    cookieConsent: true,
    dataExport: false,
    accountVisibility: "private",
    passwordExpiry: 90,
    
    // Language & Region
    language: ["English"],
    timezone: "UTC+00:00",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    currency: "USD",
    numberFormat: "1,234.56",
    weekStart: "monday",
    
    // Data & Storage
    autoBackup: true,
    backupFrequency: "daily",
    maxStorage: 10,
    compressionEnabled: true,
    syncEnabled: true,
    cloudStorage: "google",
    localCache: true,
    cacheSize: 500,
    dataSync: "wifi",
    
    // Performance
    performanceMode: "balanced",
    cacheEnabled: true,
    imageOptimization: true,
    lazyLoading: true,
    preloadData: false,
    
    // Business Settings
    businessHours: "09:00-17:00",
    timeTracking: true,
    projectManagement: true,
    teamCollaboration: true,
    clientPortal: false,
    apiAccess: false,
    
    // Custom Settings
    customTheme: "#b2dd4b",
    customMessage: "",
    notificationSound: "default",
    accessibilityMode: false,
    keyboardShortcuts: true,
    voiceCommands: false,
  };

  // Form state - initialize with API data or defaults
  const [settings, setSettings] = useState(defaultSettings);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);

  // Update local settings when API data loads
  React.useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
      
      // Initialize settings service with loaded data
      settingsService.init(settingsData);
      

    }
  }, [settingsData]);

  // Debug authentication
  React.useEffect(() => {
    console.log('Settings component loaded');
    console.log('User:', user);
    console.log('User ID:', user?.id || user?._id);
    console.log('Token:', localStorage.getItem('token'));
    console.log('Settings data:', settingsData);
  }, [user, settingsData]);





  const handleSwitchChange = (name) => (event) => {
    const newValue = event.target.checked;
    const updatedSettings = {
      ...settings,
      [name]: newValue,
    };
    
    setSettings(updatedSettings);
    

    
    // Apply real-time changes immediately
    settingsService.updateSettings({ [name]: newValue });

    // Auto-save critical settings
    if (["twoFactorAuth", "emailNotifications", "accessibilityMode", "showGridLines", "showTooltips"].includes(name)) {
      const userId = user?.id || user?._id;
      if (userId) {
        updateField({ 
          userId, 
          field: name, 
          value: newValue 
        });
      }
    }
  };

  const handleSliderChange = (name) => (event, newValue) => {
    const updatedSettings = {
      ...settings,
      [name]: newValue,
    };
    
    setSettings(updatedSettings);
    
    // Apply real-time changes for sliders
    settingsService.updateSettings({ [name]: newValue });

    // Auto-save critical slider settings
    if (["notificationVolume", "zoomLevel", "refreshInterval"].includes(name)) {
      const userId = user?.id || user?._id;
      if (userId) {
        updateField({ 
          userId, 
          field: name, 
          value: newValue 
        });
      }
    }
  };

  const handleSelectChange = (name) => (event) => {
    const newValue = event.target.value;
    const updatedSettings = {
      ...settings,
      [name]: newValue,
    };
    
    setSettings(updatedSettings);
    
    // Apply real-time changes for select fields
    settingsService.updateSettings({ [name]: newValue });

    // Auto-save critical select settings
    if (["fontSize", "performanceMode", "language", "timezone", "currency"].includes(name)) {
      const userId = user?.id || user?._id;
      if (userId) {
        updateField({ 
          userId, 
          field: name, 
          value: newValue 
        });
      }
    }
  };

  const handleMultiSelectChange = (name) => (event) => {
    const {
      target: { value },
    } = event;
    setSettings({
      ...settings,
      [name]: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleTextChange = (name) => (event) => {
    const newValue = event.target.value;
    const updatedSettings = {
      ...settings,
      [name]: newValue,
    };
    
    setSettings(updatedSettings);
    
    // Apply real-time changes for text fields
    settingsService.updateSettings({ [name]: newValue });

    // Auto-save critical text settings
    if (["customTheme", "businessHours"].includes(name)) {
      const userId = user?.id || user?._id;
      if (userId) {
        updateField({ 
          userId, 
          field: name, 
          value: newValue 
        });
      }
    }
  };

  const handleSave = async () => {
    const userId = user?.id || user?._id;
    if (!userId) {
      console.error("No valid user ID found");
      return;
    }
    
    try {
      await updateSettings({ 
        userId, 
        settings 
      }).unwrap();
      setSuccessMessage("Settings saved successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setShowSuccess(false);
    }
  };

  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  const handleResetConfirm = async () => {
    const userId = user?.id || user?._id;
    if (!userId) {
      console.error("No valid user ID found");
      return;
    }
    
    try {
      // Close dialog
      setShowResetDialog(false);
      
      // Show resetting state
      setShowSuccess(false);
      
      // Reset to backend
      const resetData = await resetSettings(userId).unwrap();
      
      // Update local state with reset data
      setSettings(resetData);
      
      // Initialize settings service with reset data
      settingsService.init(resetData);
      
      // Show success message
      setSuccessMessage("Settings reset successfully! All settings have been restored to their default values.");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
      console.log("Settings reset successfully:", resetData);
    } catch (error) {
      console.error("Failed to reset settings:", error);
      // Show error message
      setShowSuccess(false);
    }
  };

  const handleResetCancel = () => {
    setShowResetDialog(false);
  };

  // File upload handlers
  const handleProfilePictureUpload = async (file) => {
    console.log('Profile picture upload started:', file);
    const userId = user?.id || user?._id;
    if (!userId) {
      console.error('No valid user ID found');
      throw new Error("No valid user ID found");
    }
    
    console.log('User ID:', userId);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    try {
      const result = await uploadProfilePicture({ userId, file }).unwrap();
      console.log('Upload successful:', result);
      setSuccessMessage("Profile picture uploaded successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error(error.data?.message || "Failed to upload profile picture");
    }
  };

  const handleDocumentsUpload = async (files, description, category, progressCallback) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      throw new Error("No valid user ID found");
    }
    
    try {
      // Simulate progress for each file with more realistic timing
      const progressPromises = files.map((file, index) => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            const increment = Math.random() * 20 + 10; // 10-30% increments
            progress += increment;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              resolve();
            }
            progressCallback(file.name, Math.round(progress));
          }, 200 + Math.random() * 300); // 200-500ms intervals
        });
      });
      
      // Wait for progress simulation to complete
      await Promise.all(progressPromises);
      
      // Make the actual API call
      await uploadDocuments({ userId, files, description, category }).unwrap();
      setSuccessMessage(`${files.length} document(s) uploaded successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.data?.message || "Failed to upload documents");
    }
  };

  const handleDocumentDelete = async (documentId) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      throw new Error("No valid user ID found");
    }
    
    try {
      await deleteDocument({ userId, documentId }).unwrap();
      setSuccessMessage("Document deleted successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      throw new Error(error.data?.message || "Failed to delete document");
    }
  };

  const handleDocumentDownload = async (documentId) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      throw new Error("No valid user ID found");
    }
    
    try {
      const response = await fetch(`http://localhost:9000/settings/${userId}/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = ''; // Will use the original filename from the server
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error("Failed to download document");
    }
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account preferences and application settings
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleResetClick}
            disabled={isResetting || (!user?.id && !user?._id)}
          >
            {isResetting ? "Resetting..." : "Reset All Settings"}
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={isUpdating || (!user?.id && !user?._id)}
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              boxShadow: `0 3px 5px 2px ${theme.palette.primary.main}40`,
            }}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>

      {isLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Loading settings...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load settings. Please try again.
        </Alert>
      )}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {!user?.id && !user?._id && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to save your settings. Your changes will be lost when you refresh the page.
        </Alert>
      )}

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={handleResetCancel}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Reset All Settings
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            Are you sure you want to reset all settings to their default values? This action cannot be undone and will clear all your custom preferences including:
            <br />• Profile information
            <br />• Notification preferences
            <br />• Display and appearance settings
            <br />• Privacy and security settings
            <br />• Language and region preferences
            <br />• All other custom configurations
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleResetConfirm} 
            color="error" 
            variant="contained"
            disabled={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset All Settings"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Picture Upload Dialog */}
      <Dialog 
        open={showProfilePictureDialog} 
        onClose={() => {
          console.log('Dialog closing');
          setShowProfilePictureDialog(false);
        }} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Upload Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select a new profile picture. Only image files are allowed.
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 3,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  opacity: 0.8,
                },
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => {
                console.log('Upload box clicked');
                document.getElementById('profile-picture-input').click();
              }}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Click to Select Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG, or GIF files up to 5MB
              </Typography>
            </Box>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (event) => {
                console.log('File input changed:', event.target.files);
                const file = event.target.files[0];
                if (file) {
                  console.log('Selected file:', file);
                  try {
                    await handleProfilePictureUpload(file);
                    setShowProfilePictureDialog(false);
                  } catch (error) {
                    console.error('Upload failed:', error);
                  }
                }
                // Reset the input
                event.target.value = '';
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProfilePictureDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Card */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.main}15 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative" display="inline-block">
              <Avatar
                src={settings.profilePicture ? `http://localhost:9000/${settings.profilePicture}` : undefined}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={() => setShowProfilePictureDialog(true)}
              >
                {settings.firstName.charAt(0)}{settings.lastName.charAt(0)}
              </Avatar>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'background.paper',
                  border: '2px solid',
                  borderColor: theme.palette.background.paper,
                  boxShadow: 1,
                  zIndex: 2,
                  p: 0.5,
                  '&:hover': { backgroundColor: theme.palette.primary.light },
                }}
                onClick={() => setShowProfilePictureDialog(true)}
                aria-label="Edit profile picture"
              >
                <EditOutlined fontSize="small" />
              </IconButton>
            </Box>
            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {settings.firstName} {settings.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                {settings.jobTitle} • {settings.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {settings.company}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Member since 2023
              </Typography>
              <Chip 
                label="Active" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Person />} 
            label="Profile" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Notifications />} 
            label="Notifications" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Palette />} 
            label="Appearance" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Security />} 
            label="Security" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Language />} 
            label="Language" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Storage />} 
            label="Storage" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Speed />} 
            label="Performance" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<Business />} 
            label="Business" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab 
            icon={<CloudUpload />} 
            label="Files" 
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              Profile Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={settings.firstName}
                  onChange={handleTextChange("firstName")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={settings.lastName}
                  onChange={handleTextChange("lastName")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={handleTextChange("email")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={settings.phone}
                  onChange={handleTextChange("phone")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={settings.company}
                  onChange={handleTextChange("company")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={settings.jobTitle}
                  onChange={handleTextChange("jobTitle")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={settings.department}
                    label="Department"
                    onChange={handleSelectChange("department")}
                  >
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="HR">Human Resources</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications color="primary" />
                  Notification Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Email Notifications" 
                      secondary="Receive notifications via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleSwitchChange("emailNotifications")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsActive color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Push Notifications" 
                      secondary="Receive real-time push notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={handleSwitchChange("pushNotifications")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="SMS Notifications" 
                      secondary="Receive notifications via SMS"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={handleSwitchChange("smsNotifications")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Business color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Marketing Emails" 
                      secondary="Receive promotional and marketing content"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.marketingEmails}
                        onChange={handleSwitchChange("marketingEmails")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Security Alerts" 
                      secondary="Get notified about security events"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.securityAlerts}
                        onChange={handleSwitchChange("securityAlerts")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notification Volume
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Slider
                    value={settings.notificationVolume}
                    onChange={handleSliderChange("notificationVolume")}
                    min={0}
                    max={100}
                    step={10}
                    marks
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.quietHours}
                      onChange={handleSwitchChange("quietHours")}
                    />
                  }
                  label="Quiet Hours"
                />
                {settings.quietHours && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      value={settings.quietHoursStart}
                      onChange={handleTextChange("quietHoursStart")}
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      fullWidth
                      label="End Time"
                      type="time"
                      value={settings.quietHoursEnd}
                      onChange={handleTextChange("quietHoursEnd")}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Palette color="primary" />
                  Theme & Appearance
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FormatSize color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Compact Mode" 
                      secondary="Reduce spacing for more content"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.compactMode}
                        onChange={handleSwitchChange("compactMode")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesome color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Show Animations" 
                      secondary="Enable smooth transitions and animations"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.showAnimations}
                        onChange={handleSwitchChange("showAnimations")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <Box sx={{ mt: 3 }}>
                  <Typography gutterBottom>Font Size</Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={settings.fontSize}
                      onChange={handleSelectChange("fontSize")}
                    >
                      <FormControlLabel value="small" control={<Radio />} label="Small" />
                      <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                      <FormControlLabel value="large" control={<Radio />} label="Large" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Custom Theme
                </Typography>
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={settings.customTheme}
                  onChange={handleTextChange("customTheme")}
                  sx={{ mb: 3 }}
                />
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Zoom Level</Typography>
                  <Slider
                    value={settings.zoomLevel}
                    onChange={handleSliderChange("zoomLevel")}
                    min={80}
                    max={120}
                    step={10}
                    marks
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showGridLines}
                      onChange={handleSwitchChange("showGridLines")}
                    />
                  }
                  label="Show Grid Lines"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showTooltips}
                      onChange={handleSwitchChange("showTooltips")}
                    />
                  }
                  label="Show Tooltips"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security color="primary" />
                  Security Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Lock color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Two-Factor Authentication" 
                      secondary="Add an extra layer of security"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={handleSwitchChange("twoFactorAuth")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <PrivacyTip color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Location Sharing" 
                      secondary="Allow location-based features"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.locationSharing}
                        onChange={handleSwitchChange("locationSharing")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Analytics color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Analytics Tracking" 
                      secondary="Help improve the application"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.analyticsTracking}
                        onChange={handleSwitchChange("analyticsTracking")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Session & Privacy
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Session Timeout (minutes)</Typography>
                  <Slider
                    value={settings.sessionTimeout}
                    onChange={handleSliderChange("sessionTimeout")}
                    min={15}
                    max={480}
                    step={15}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Password Expiry (days)</Typography>
                  <Slider
                    value={settings.passwordExpiry}
                    onChange={handleSliderChange("passwordExpiry")}
                    min={30}
                    max={365}
                    step={30}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Account Visibility</InputLabel>
                  <Select
                    value={settings.accountVisibility}
                    label="Account Visibility"
                    onChange={handleSelectChange("accountVisibility")}
                  >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="friends">Friends Only</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Language color="primary" />
              Language & Regional Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Languages</InputLabel>
                  <Select
                    multiple
                    value={settings.language}
                    onChange={handleMultiSelectChange("language")}
                    input={<OutlinedInput label="Languages" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {languages.map((language) => (
                      <MenuItem key={language} value={language}>
                        <Checkbox checked={settings.language.indexOf(language) > -1} />
                        <ListItemText primary={language} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    label="Timezone"
                    onChange={handleSelectChange("timezone")}
                  >
                    {timezones.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.currency}
                    label="Currency"
                    onChange={handleSelectChange("currency")}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="JPY">JPY (¥)</MenuItem>
                    <MenuItem value="CAD">CAD (C$)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Date Format</FormLabel>
                  <RadioGroup
                    value={settings.dateFormat}
                    onChange={handleSelectChange("dateFormat")}
                  >
                    <FormControlLabel value="MM/DD/YYYY" control={<Radio />} label="MM/DD/YYYY" />
                    <FormControlLabel value="DD/MM/YYYY" control={<Radio />} label="DD/MM/YYYY" />
                    <FormControlLabel value="YYYY-MM-DD" control={<Radio />} label="YYYY-MM-DD" />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Time Format</FormLabel>
                  <RadioGroup
                    value={settings.timeFormat}
                    onChange={handleSelectChange("timeFormat")}
                  >
                    <FormControlLabel value="12h" control={<Radio />} label="12-hour" />
                    <FormControlLabel value="24h" control={<Radio />} label="24-hour" />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Week Start</FormLabel>
                  <RadioGroup
                    value={settings.weekStart}
                    onChange={handleSelectChange("weekStart")}
                  >
                    <FormControlLabel value="sunday" control={<Radio />} label="Sunday" />
                    <FormControlLabel value="monday" control={<Radio />} label="Monday" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 5 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Storage color="primary" />
                  Storage & Backup
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Backup color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Auto Backup" 
                      secondary="Automatically backup your data"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.autoBackup}
                        onChange={handleSwitchChange("autoBackup")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Sync color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Cloud Sync" 
                      secondary="Sync data across devices"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.syncEnabled}
                        onChange={handleSwitchChange("syncEnabled")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <CloudDone color="primary" />
                    </ListItemIcon>
                    <MuiListItemText 
                      primary="Local Cache" 
                      secondary="Store data locally for faster access"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.localCache}
                        onChange={handleSwitchChange("localCache")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Storage Settings
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Backup Frequency</InputLabel>
                  <Select
                    value={settings.backupFrequency}
                    label="Backup Frequency"
                    onChange={handleSelectChange("backupFrequency")}
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Cloud Storage</InputLabel>
                  <Select
                    value={settings.cloudStorage}
                    label="Cloud Storage"
                    onChange={handleSelectChange("cloudStorage")}
                  >
                    <MenuItem value="google">Google Drive</MenuItem>
                    <MenuItem value="dropbox">Dropbox</MenuItem>
                    <MenuItem value="onedrive">OneDrive</MenuItem>
                    <MenuItem value="icloud">iCloud</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Max Storage (GB)</Typography>
                  <Slider
                    value={settings.maxStorage}
                    onChange={handleSliderChange("maxStorage")}
                    min={1}
                    max={100}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box>
                  <Typography gutterBottom>Cache Size (MB)</Typography>
                  <Slider
                    value={settings.cacheSize}
                    onChange={handleSliderChange("cacheSize")}
                    min={100}
                    max={1000}
                    step={100}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 6 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Speed color="primary" />
              Performance Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Performance Mode</InputLabel>
                  <Select
                    value={settings.performanceMode}
                    label="Performance Mode"
                    onChange={handleSelectChange("performanceMode")}
                  >
                    <MenuItem value="power-saver">Power Saver</MenuItem>
                    <MenuItem value="balanced">Balanced</MenuItem>
                    <MenuItem value="high-performance">High Performance</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.cacheEnabled}
                      onChange={handleSwitchChange("cacheEnabled")}
                    />
                  }
                  label="Enable Caching"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.imageOptimization}
                      onChange={handleSwitchChange("imageOptimization")}
                    />
                  }
                  label="Image Optimization"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.lazyLoading}
                      onChange={handleSwitchChange("lazyLoading")}
                    />
                  }
                  label="Lazy Loading"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Auto Refresh Interval (seconds)</Typography>
                  <Slider
                    value={settings.refreshInterval}
                    onChange={handleSliderChange("refreshInterval")}
                    min={5}
                    max={300}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoRefresh}
                      onChange={handleSwitchChange("autoRefresh")}
                    />
                  }
                  label="Auto Refresh"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.preloadData}
                      onChange={handleSwitchChange("preloadData")}
                    />
                  }
                  label="Preload Data"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSave}
                      onChange={handleSwitchChange("autoSave")}
                    />
                  }
                  label="Auto Save"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 7 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business color="primary" />
              Business Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Hours"
                  value={settings.businessHours}
                  onChange={handleTextChange("businessHours")}
                  sx={{ mb: 3 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.timeTracking}
                      onChange={handleSwitchChange("timeTracking")}
                    />
                  }
                  label="Time Tracking"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.projectManagement}
                      onChange={handleSwitchChange("projectManagement")}
                    />
                  }
                  label="Project Management"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.teamCollaboration}
                      onChange={handleSwitchChange("teamCollaboration")}
                    />
                  }
                  label="Team Collaboration"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.clientPortal}
                      onChange={handleSwitchChange("clientPortal")}
                    />
                  }
                  label="Client Portal"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.apiAccess}
                      onChange={handleSwitchChange("apiAccess")}
                    />
                  }
                  label="API Access"
                />
                <TextField
                  fullWidth
                  label="Custom Message"
                  multiline
                  rows={4}
                  value={settings.customMessage}
                  onChange={handleTextChange("customMessage")}
                  placeholder="Enter your custom business message here..."
                  helperText="This message will be displayed to clients and team members"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 8 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUpload color="primary" />
              File Management
            </Typography>
            <FileUpload
              onUpload={handleDocumentsUpload}
              onDelete={handleDocumentDelete}
              onDownload={handleDocumentDownload}
              files={documentsData?.documents || []}
              maxFiles={5}
              maxSize={10 * 1024 * 1024} // 10MB
              title="Upload Documents"
              description="Drag and drop documents here, or click to select files"
              showPreview={true}
              showDescription={true}
              showCategory={true}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Settings; 