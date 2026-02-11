import axios from 'axios';
import * as LocalAuthentication from 'expo-local-authentication';
import StorageService from './StorageService';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.agentforge.io';

class AuthService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // User Authentication
  async register(email, password, name) {
    try {
      const response = await this.client.post('/auth/register', {
        email,
        password,
        name,
      });
      
      const { user, token } = response.data;
      await StorageService.saveUserProfile({ ...user, token });
      
      return { user, token };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async login(email, password) {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password,
      });
      
      const { user, token } = response.data;
      await StorageService.saveUserProfile({ ...user, token });
      
      return { user, token };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async logout() {
    try {
      await StorageService.removeItem('@agentforge_user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const user = await StorageService.getUserProfile();
      return user;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(updates) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const response = await this.client.put('/auth/profile', updates, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const updatedUser = { ...user, ...response.data };
      await StorageService.saveUserProfile(updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await this.client.post(
        '/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  async resetPassword(email) {
    try {
      await this.client.post('/auth/reset-password', { email });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  }

  // Biometric Authentication
  async isBiometricAvailable() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error('Biometric check error:', error);
      return false;
    }
  }

  async authenticateWithBiometric() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access AgentForge',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });
      
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async enableBiometric() {
    const available = await this.isBiometricAvailable();
    if (!available) {
      throw new Error('Biometric authentication is not available on this device');
    }

    const authenticated = await this.authenticateWithBiometric();
    if (authenticated) {
      const settings = await StorageService.getSettings();
      await StorageService.saveSettings({ ...settings, biometricAuth: true });
      return true;
    }
    
    return false;
  }

  async disableBiometric() {
    const settings = await StorageService.getSettings();
    await StorageService.saveSettings({ ...settings, biometricAuth: false });
    return true;
  }

  // Session Management
  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return user !== null && user.token !== undefined;
    } catch (error) {
      return false;
    }
  }

  async refreshToken() {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const response = await this.client.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const { token } = response.data;
      await StorageService.saveUserProfile({ ...user, token });
      
      return token;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }
}

export default new AuthService();