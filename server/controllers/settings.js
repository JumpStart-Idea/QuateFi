import Settings from "../models/Settings.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only access their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only access your own settings." });
    }
    
    let settings = await Settings.findOne({ userId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({ userId });
      await settings.save();
    }
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only update their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only update your own settings." });
    }
    
    // Remove userId from update data to prevent changing the owner
    delete updateData.userId;
    
    const settings = await Settings.findOneAndUpdate(
      { userId },
      updateData,
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset user settings to defaults
export const resetUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only reset their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only reset your own settings." });
    }
    
    // Delete existing settings
    await Settings.findOneAndDelete({ userId });
    
    // Create new default settings with explicit defaults
    const defaultSettings = {
      userId,
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
      customTheme: "#1976d2",
      customMessage: "",
      notificationSound: "default",
      accessibilityMode: false,
      keyboardShortcuts: true,
      voiceCommands: false,
    };
    
    const settings = new Settings(defaultSettings);
    await settings.save();
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get settings by specific field
export const getSettingsField = async (req, res) => {
  try {
    const { userId, field } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only access their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only access your own settings." });
    }
    
    const settings = await Settings.findOne({ userId }).select(field);
    
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    
    res.status(200).json({ [field]: settings[field] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update specific settings field
export const updateSettingsField = async (req, res) => {
  try {
    const { userId, field } = req.params;
    const { value } = req.body;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only update their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only update your own settings." });
    }
    
    const updateData = { [field]: value };
    
    const settings = await Settings.findOneAndUpdate(
      { userId },
      updateData,
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );
    
    res.status(200).json({ [field]: settings[field] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  console.log('Profile picture upload request received');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  console.log('Request user:', req.user);
  
  try {
    const { userId } = req.params;
    console.log('User ID from params:', userId);
    console.log('User ID from token:', req.user.id);
    console.log('User ID types:', {
      paramType: typeof userId,
      tokenType: typeof req.user.id,
      paramValue: userId,
      tokenValue: req.user.id
    });
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid user ID:', userId);
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only upload to their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    console.log('Comparing user IDs:', {
      paramUserId,
      tokenUserId,
      match: paramUserId === tokenUserId
    });
    
    if (paramUserId !== tokenUserId) {
      console.error('Access denied. User ID mismatch:', tokenUserId, 'vs', paramUserId);
      return res.status(403).json({ message: "Access denied. You can only upload to your own settings." });
    }
    
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });
    
    // Check if file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      console.error('Invalid file type:', req.file.mimetype);
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Only image files are allowed for profile pictures" });
    }
    
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      console.error('Settings not found for user:', userId);
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Settings not found" });
    }
    
    // Delete old profile picture if exists
    if (settings.profilePicture && fs.existsSync(settings.profilePicture)) {
      console.log('Deleting old profile picture:', settings.profilePicture);
      fs.unlinkSync(settings.profilePicture);
    }
    
    // Update settings with new profile picture path
    settings.profilePicture = req.file.path;
    await settings.save();
    
    console.log('Profile picture updated successfully:', req.file.path);
    
    res.status(200).json({ 
      message: "Profile picture uploaded successfully",
      profilePicture: req.file.path,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

// Upload documents
export const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, category } = req.body;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only upload to their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only upload to your own settings." });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      // Delete uploaded files
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(404).json({ message: "Settings not found" });
    }
    
    // Process uploaded files
    const uploadedDocuments = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadDate: new Date(),
      description: description || "",
      category: category || "other"
    }));
    
    // Add documents to settings
    settings.documents.push(...uploadedDocuments);
    await settings.save();
    
    res.status(200).json({ 
      message: `${uploadedDocuments.length} document(s) uploaded successfully`,
      documents: uploadedDocuments
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { userId, documentId } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only delete from their own settings
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only delete from your own settings." });
    }
    
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    
    // Find document to delete
    const documentIndex = settings.documents.findIndex(doc => doc._id.toString() === documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    const documentToDelete = settings.documents[documentIndex];
    
    // Delete file from filesystem
    if (fs.existsSync(documentToDelete.filePath)) {
      fs.unlinkSync(documentToDelete.filePath);
    }
    
    // Remove document from settings
    settings.documents.splice(documentIndex, 1);
    await settings.save();
    
    res.status(200).json({ 
      message: "Document deleted successfully",
      deletedDocument: documentToDelete
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get documents
export const getDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only access their own documents
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only access your own documents." });
    }
    
    const settings = await Settings.findOne({ userId }).select('documents');
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    
    res.status(200).json({ documents: settings.documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download document
export const downloadDocument = async (req, res) => {
  try {
    const { userId, documentId } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only download their own documents
    // Convert both IDs to strings for comparison
    const paramUserId = userId.toString();
    const tokenUserId = req.user.id.toString();
    
    if (paramUserId !== tokenUserId) {
      return res.status(403).json({ message: "Access denied. You can only download your own documents." });
    }
    
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    
    // Find document
    const document = settings.documents.find(doc => doc._id.toString() === documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }
    
    // Send file
    res.download(document.filePath, document.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 