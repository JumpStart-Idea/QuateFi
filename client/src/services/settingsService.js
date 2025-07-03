// Real-time Settings Service
// This service manages application-wide settings and provides real-time updates

class SettingsService {
  constructor() {
    this.listeners = new Map();
    this.currentSettings = {};
    this.initialized = false;
  }

  // Initialize the service with settings
  init(settings) {
    this.currentSettings = settings;
    this.initialized = true;
    this.applySettings(settings);
  }

  // Update settings and notify listeners
  updateSettings(newSettings) {
    this.currentSettings = { ...this.currentSettings, ...newSettings };
    this.applySettings(newSettings);
    this.notifyListeners(newSettings);
  }

  // Get current settings
  getSettings() {
    return this.currentSettings;
  }

  // Get a specific setting
  getSetting(key) {
    return this.currentSettings[key];
  }

  // Apply settings to the application
  applySettings(settings) {
    Object.entries(settings).forEach(([key, value]) => {
      this.applySetting(key, value);
    });
  }

  // Apply a single setting
  applySetting(key, value) {
    switch (key) {
      case 'darkMode':
        this.applyThemeMode(value);
        break;
      case 'fontSize':
        this.applyFontSize(value);
        break;
      case 'zoomLevel':
        this.applyZoomLevel(value);
        break;
      case 'customTheme':
        this.applyCustomTheme(value);
        break;
      case 'notificationVolume':
        this.applyNotificationVolume(value);
        break;
      case 'quietHours':
        this.applyQuietHours(value);
        break;
      case 'accessibilityMode':
        this.applyAccessibilityMode(value);
        break;
      case 'contrast':
        this.applyContrast(value);
        break;
      case 'showGridLines':
        this.applyGridLines(value);
        break;
      case 'showTooltips':
        this.applyTooltips(value);
        break;
      case 'autoRefresh':
        this.applyAutoRefresh(value);
        break;
      case 'refreshInterval':
        this.applyRefreshInterval(value);
        break;
      case 'performanceMode':
        this.applyPerformanceMode(value);
        break;
      case 'language':
        this.applyLanguage(value);
        break;
      case 'timezone':
        this.applyTimezone(value);
        break;
      case 'currency':
        this.applyCurrency(value);
        break;
    }
  }

  // Theme mode
  applyThemeMode(isDark) {
    // This will be handled by Redux
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { mode: isDark ? 'dark' : 'light' } 
    }));
  }

  // Font size
  applyFontSize(size) {
    const fontSize = size === "small" ? "14px" : size === "large" ? "18px" : "16px";
    document.documentElement.style.fontSize = fontSize;
  }

  // Zoom level
  applyZoomLevel(level) {
    document.body.style.zoom = `${level / 100}`;
  }

  // Custom theme color
  applyCustomTheme(color) {
    document.documentElement.style.setProperty('--custom-primary-color', color);
  }

  // Notification volume
  applyNotificationVolume(volume) {
    localStorage.setItem('notificationVolume', volume);
    window.dispatchEvent(new CustomEvent('notificationVolumeChanged', { 
      detail: { volume } 
    }));
  }

  // Quiet hours
  applyQuietHours(enabled) {
    localStorage.setItem('quietHours', JSON.stringify({ enabled }));
    window.dispatchEvent(new CustomEvent('quietHoursChanged', { 
      detail: { enabled } 
    }));
  }

  // Accessibility mode
  applyAccessibilityMode(enabled) {
    document.body.classList.toggle('accessibility-mode', enabled);
    window.dispatchEvent(new CustomEvent('accessibilityModeChanged', { 
      detail: { enabled } 
    }));
  }

  // Contrast mode
  applyContrast(contrast) {
    document.body.setAttribute('data-contrast', contrast);
  }

  // Grid lines
  applyGridLines(show) {
    document.body.classList.toggle('show-grid-lines', show);
  }

  // Tooltips
  applyTooltips(show) {
    document.body.classList.toggle('show-tooltips', show);
  }

  // Auto refresh
  applyAutoRefresh(enabled) {
    if (window.autoRefreshInterval) {
      clearInterval(window.autoRefreshInterval);
    }
    
    if (enabled && this.currentSettings.refreshInterval) {
      window.autoRefreshInterval = setInterval(() => {
        window.dispatchEvent(new CustomEvent('refreshData'));
      }, this.currentSettings.refreshInterval * 1000);
    }
  }

  // Refresh interval
  applyRefreshInterval(interval) {
    if (this.currentSettings.autoRefresh) {
      this.applyAutoRefresh(true);
    }
  }

  // Performance mode
  applyPerformanceMode(mode) {
    localStorage.setItem('performanceMode', mode);
    
    document.body.classList.remove('power-saver-mode', 'high-performance-mode');
    
    switch (mode) {
      case 'power-saver':
        document.body.classList.add('power-saver-mode');
        break;
      case 'high-performance':
        document.body.classList.add('high-performance-mode');
        break;
    }
    
    window.dispatchEvent(new CustomEvent('performanceModeChanged', { 
      detail: { mode } 
    }));
  }

  // Language
  applyLanguage(languages) {
    if (languages && languages.length > 0) {
      const primaryLanguage = languages[0];
      localStorage.setItem('preferredLanguage', primaryLanguage);
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: primaryLanguage }
      }));
    }
  }

  // Timezone
  applyTimezone(timezone) {
    localStorage.setItem('userTimezone', timezone);
    window.dispatchEvent(new CustomEvent('timezoneChanged', {
      detail: { timezone }
    }));
  }

  // Currency
  applyCurrency(currency) {
    localStorage.setItem('userCurrency', currency);
    window.dispatchEvent(new CustomEvent('currencyChanged', {
      detail: { currency }
    }));
  }

  // Subscribe to settings changes
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  // Notify listeners of changes
  notifyListeners(changedSettings) {
    Object.entries(changedSettings).forEach(([key, value]) => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        callbacks.forEach(callback => callback(value));
      }
    });
  }

  // Check if quiet hours are active
  isQuietHours() {
    const quietHours = JSON.parse(localStorage.getItem('quietHours') || '{}');
    if (!quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = (this.currentSettings.quietHoursStart || "22:00").split(':').map(Number);
    const [endHour, endMin] = (this.currentSettings.quietHoursEnd || "08:00").map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime > endTime) {
      // Overnight quiet hours
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      // Same day quiet hours
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  // Get notification volume considering quiet hours
  getEffectiveNotificationVolume() {
    if (this.isQuietHours()) {
      return Math.min(this.currentSettings.notificationVolume || 70, 30);
    }
    return this.currentSettings.notificationVolume || 70;
  }

  // Format currency based on user settings
  formatCurrency(amount) {
    const currency = this.currentSettings.currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    });
    return formatter.format(amount);
  }

  // Format date based on user settings
  formatDate(date) {
    const timezone = this.currentSettings.timezone || 'UTC+00:00';
    const dateFormat = this.currentSettings.dateFormat || 'MM/DD/YYYY';
    
    // Convert timezone offset to minutes
    const offset = timezone.replace('UTC', '').replace(':', '');
    const offsetMinutes = parseInt(offset) * 60;
    
    const utcDate = new Date(date.getTime() + offsetMinutes * 60000);
    
    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return utcDate.toLocaleDateString('en-US');
      case 'DD/MM/YYYY':
        return utcDate.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return utcDate.toISOString().split('T')[0];
      default:
        return utcDate.toLocaleDateString();
    }
  }
}

// Create singleton instance
const settingsService = new SettingsService();

export default settingsService; 