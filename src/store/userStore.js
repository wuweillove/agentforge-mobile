import { create } from 'zustand';
import AuthService from '../services/AuthService';
import StorageService from '../services/StorageService';
import StripePayments from '../services/StripePayments';

export const useUserStore = create((set, get) => ({
  user: null,
  subscription: null,
  credits: 0,
  loading: false,
  error: null,

  // Initialize user data
  initialize: async () => {
    set({ loading: true });
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        const subscription = await StripePayments.getSubscription();
        const creditsData = await StorageService.getCredits();
        set({
          user,
          subscription,
          credits: creditsData.balance || 0,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Authentication
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await AuthService.login(email, password);
      set({ user: { ...user, token }, loading: false });
      await get().initialize();
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await AuthService.register(email, password, name);
      set({ user: { ...user, token }, loading: false });
      await get().initialize();
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    await AuthService.logout();
    set({ user: null, subscription: null, credits: 0 });
  },

  // Subscription
  updateSubscription: async (newSubscription) => {
    set({ subscription: newSubscription });
    await StorageService.saveSubscription(newSubscription);
  },

  // Credits
  updateCredits: async (newBalance) => {
    set({ credits: newBalance });
    const creditsData = await StorageService.getCredits();
    await StorageService.saveCredits({ ...creditsData, balance: newBalance });
  },

  refreshCredits: async () => {
    const creditsData = await StorageService.getCredits();
    set({ credits: creditsData.balance || 0 });
  },

  // Profile
  updateProfile: async (updates) => {
    try {
      const updatedUser = await AuthService.updateProfile(updates);
      set({ user: updatedUser });
      return true;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));