import Settings from "../models/Settings.js";
import mongoose from "mongoose";

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    
    // Ensure user can only access their own settings
    if (req.user.id !== userId) {
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
    if (req.user.id !== userId) {
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
    if (req.user.id !== userId) {
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
    if (req.user.id !== userId) {
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
    if (req.user.id !== userId) {
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