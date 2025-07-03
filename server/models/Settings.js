import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Profile Settings
    firstName: { type: String, default: "John" },
    lastName: { type: String, default: "Doe" },
    email: { type: String, default: "john.doe@example.com" },
    phone: { type: String, default: "+1 (555) 123-4567" },
    company: { type: String, default: "Acme Corp" },
    jobTitle: { type: String, default: "Senior Manager" },
    department: { type: String, default: "Sales" },
    avatar: { type: String, default: "" },
    
    // Notifications
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: true },
    securityAlerts: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    priceAlerts: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: false },
    notificationVolume: { type: Number, default: 70, min: 0, max: 100 },
    quietHours: { type: Boolean, default: false },
    quietHoursStart: { type: String, default: "22:00" },
    quietHoursEnd: { type: String, default: "08:00" },
    
    // Display & Appearance
    compactMode: { type: Boolean, default: false },
    showAnimations: { type: Boolean, default: true },
    autoRefresh: { type: Boolean, default: true },
    refreshInterval: { type: Number, default: 30, min: 5, max: 300 },
    fontSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    contrast: { type: String, enum: ["normal", "high", "low"], default: "normal" },
    zoomLevel: { type: Number, default: 100, min: 80, max: 120 },
    showGridLines: { type: Boolean, default: true },
    showTooltips: { type: Boolean, default: true },
    autoSave: { type: Boolean, default: true },
    
    // Privacy & Security
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 60, min: 15, max: 480 },
    dataRetention: { type: Number, default: 365, min: 30, max: 1095 },
    analyticsTracking: { type: Boolean, default: true },
    crashReporting: { type: Boolean, default: false },
    locationSharing: { type: Boolean, default: false },
    cookieConsent: { type: Boolean, default: true },
    dataExport: { type: Boolean, default: false },
    accountVisibility: { type: String, enum: ["public", "private", "friends"], default: "private" },
    passwordExpiry: { type: Number, default: 90, min: 30, max: 365 },
    
    // Language & Region
    language: [{ type: String, default: ["English"] }],
    timezone: { type: String, default: "UTC+00:00" },
    dateFormat: { type: String, enum: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], default: "MM/DD/YYYY" },
    timeFormat: { type: String, enum: ["12h", "24h"], default: "12h" },
    currency: { type: String, default: "USD" },
    numberFormat: { type: String, default: "1,234.56" },
    weekStart: { type: String, enum: ["sunday", "monday"], default: "monday" },
    
    // Data & Storage
    autoBackup: { type: Boolean, default: true },
    backupFrequency: { type: String, enum: ["hourly", "daily", "weekly", "monthly"], default: "daily" },
    maxStorage: { type: Number, default: 10, min: 1, max: 100 },
    compressionEnabled: { type: Boolean, default: true },
    syncEnabled: { type: Boolean, default: true },
    cloudStorage: { type: String, enum: ["google", "dropbox", "onedrive", "icloud"], default: "google" },
    localCache: { type: Boolean, default: true },
    cacheSize: { type: Number, default: 500, min: 100, max: 1000 },
    dataSync: { type: String, enum: ["wifi", "always", "never"], default: "wifi" },
    
    // Performance
    performanceMode: { type: String, enum: ["power-saver", "balanced", "high-performance"], default: "balanced" },
    cacheEnabled: { type: Boolean, default: true },
    imageOptimization: { type: Boolean, default: true },
    lazyLoading: { type: Boolean, default: true },
    preloadData: { type: Boolean, default: false },
    
    // Business Settings
    businessHours: { type: String, default: "09:00-17:00" },
    timeTracking: { type: Boolean, default: true },
    projectManagement: { type: Boolean, default: true },
    teamCollaboration: { type: Boolean, default: true },
    clientPortal: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false },
    
    // Custom Settings
    customTheme: { type: String, default: "#1976d2" },
    customMessage: { type: String, default: "" },
    notificationSound: { type: String, enum: ["default", "chime", "bell", "none"], default: "default" },
    accessibilityMode: { type: Boolean, default: false },
    keyboardShortcuts: { type: Boolean, default: true },
    voiceCommands: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings; 