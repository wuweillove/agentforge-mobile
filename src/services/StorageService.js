import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  WORKFLOWS: '@agentforge:workflows',
  API_KEY: '@agentforge:api_key',
  SETTINGS: '@agentforge:settings',
  USER_DATA: '@agentforge:user_data',
};

class StorageService {
  // Workflows
  async saveWorkflows(workflows) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WORKFLOWS,
        JSON.stringify(workflows)
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving workflows:', error);
      return { success: false, error };
    }
  }

  async getWorkflows() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKFLOWS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading workflows:', error);
      return [];
    }
  }

  async clearWorkflows() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.WORKFLOWS);
      return { success: true };
    } catch (error) {
      console.error('Error clearing workflows:', error);
      return { success: false, error };
    }
  }

  // API Key
  async saveApiKey(apiKey) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
      return { success: true };
    } catch (error) {
      console.error('Error saving API key:', error);
      return { success: false, error };
    }
  }

  async getApiKey() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error('Error loading API key:', error);
      return null;
    }
  }

  async deleteApiKey() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.API_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error deleting API key:', error);
      return { success: false, error };
    }
  }

  // Settings
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error };
    }
  }

  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  // User Data
  async saveUserData(userData) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving user data:', error);
      return { success: false, error };
    }
  }

  async getUserData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  // Clear all data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.WORKFLOWS,
        STORAGE_KEYS.API_KEY,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.USER_DATA,
      ]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing all data:', error);
      return { success: false, error };
    }
  }
}

export default new StorageService();
