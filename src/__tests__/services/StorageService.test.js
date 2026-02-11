import StorageService from '../../services/StorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('StorageService', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  describe('Workflows', () => {
    it('should save workflows', async () => {
      const workflows = [{ id: '1', name: 'Test Workflow' }];
      const result = await StorageService.saveWorkflows(workflows);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should get workflows', async () => {
      const workflows = [{ id: '1', name: 'Test Workflow' }];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(workflows));
      
      const result = await StorageService.getWorkflows();
      
      expect(result).toEqual(workflows);
    });

    it('should return empty array when no workflows exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const result = await StorageService.getWorkflows();
      
      expect(result).toEqual([]);
    });
  });

  describe('Settings', () => {
    it('should save settings', async () => {
      const settings = { autoSave: true, notifications: false };
      const result = await StorageService.saveSettings(settings);
      
      expect(result).toBe(true);
    });

    it('should get settings with defaults', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const result = await StorageService.getSettings();
      
      expect(result).toHaveProperty('autoSave');
      expect(result).toHaveProperty('notifications');
    });
  });

  describe('Credits', () => {
    it('should save and retrieve credits', async () => {
      const credits = { balance: 1000, history: [] };
      await StorageService.saveCredits(credits);
      
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(credits));
      const result = await StorageService.getCredits();
      
      expect(result.balance).toBe(1000);
    });
  });
});
