import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  WORKFLOWS: '@agentforge_workflows',
  USER_PROFILE: '@agentforge_user',
  SETTINGS: '@agentforge_settings',
  CREDITS: '@agentforge_credits',
  SUBSCRIPTION: '@agentforge_subscription',
};

class StorageService {
  // Generic methods
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  }

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Workflows
  async saveWorkflows(workflows) {
    return await this.setItem(STORAGE_KEYS.WORKFLOWS, workflows);
  }

  async getWorkflows() {
    const workflows = await this.getItem(STORAGE_KEYS.WORKFLOWS);
    return workflows || [];
  }

  // User Profile
  async saveUserProfile(profile) {
    return await this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  async getUserProfile() {
    return await this.getItem(STORAGE_KEYS.USER_PROFILE);
  }

  // Settings
  async saveSettings(settings) {
    return await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async getSettings() {
    const defaultSettings = {
      autoSave: true,
      notifications: true,
      darkMode: true,
      biometricAuth: false,
    };
    const settings = await this.getItem(STORAGE_KEYS.SETTINGS);
    return settings || defaultSettings;
  }

  // Credits
  async saveCredits(credits) {
    return await this.setItem(STORAGE_KEYS.CREDITS, credits);
  }

  async getCredits() {
    const credits = await this.getItem(STORAGE_KEYS.CREDITS);
    return credits || { balance: 0, history: [] };
  }

  // Subscription
  async saveSubscription(subscription) {
    return await this.setItem(STORAGE_KEYS.SUBSCRIPTION, subscription);
  }

  async getSubscription() {
    const subscription = await this.getItem(STORAGE_KEYS.SUBSCRIPTION);
    return subscription || { tier: 'free', status: 'active' };
  }
}

export default new StorageService();