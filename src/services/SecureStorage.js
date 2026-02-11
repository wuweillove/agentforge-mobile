import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'agentforge_secure_key_2026';

const API_KEY_STORAGE = {
  OPENAI: 'api_key_openai',
  ANTHROPIC: 'api_key_anthropic',
  GOOGLE: 'api_key_google',
  OPENCLAW: 'api_key_openclaw',
};

// Encrypt data
const encrypt = (data) => {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data
const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Store API key securely
export const storeApiKey = async (provider, apiKey) => {
  try {
    const storageKey = API_KEY_STORAGE[provider.toUpperCase()];
    if (!storageKey) {
      throw new Error(`Invalid provider: ${provider}`);
    }

    const encryptedKey = encrypt(apiKey);
    await SecureStore.setItemAsync(storageKey, encryptedKey);
    return true;
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
};

// Retrieve API key
export const getApiKey = async (provider) => {
  try {
    const storageKey = API_KEY_STORAGE[provider.toUpperCase()];
    if (!storageKey) {
      throw new Error(`Invalid provider: ${provider}`);
    }

    const encryptedKey = await SecureStore.getItemAsync(storageKey);
    if (!encryptedKey) {
      return null;
    }

    return decrypt(encryptedKey);
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

// Delete API key
export const deleteApiKey = async (provider) => {
  try {
    const storageKey = API_KEY_STORAGE[provider.toUpperCase()];
    if (!storageKey) {
      throw new Error(`Invalid provider: ${provider}`);
    }

    await SecureStore.deleteItemAsync(storageKey);
    return true;
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

// Check if API key exists
export const hasApiKey = async (provider) => {
  try {
    const apiKey = await getApiKey(provider);
    return apiKey !== null && apiKey.length > 0;
  } catch (error) {
    return false;
  }
};

// Get all configured providers
export const getConfiguredProviders = async () => {
  const providers = [];
  for (const [name, key] of Object.entries(API_KEY_STORAGE)) {
    const hasKey = await hasApiKey(name);
    if (hasKey) {
      providers.push(name.toLowerCase());
    }
  }
  return providers;
};

// Validate API key format
export const validateApiKey = (provider, apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return { valid: false, error: 'API key must be a non-empty string' };
  }

  const patterns = {
    OPENAI: /^sk-[a-zA-Z0-9]{48}$/,
    ANTHROPIC: /^sk-ant-[a-zA-Z0-9-]{95}$/,
    GOOGLE: /^[a-zA-Z0-9-_]{39}$/,
    OPENCLAW: /^oc-[a-zA-Z0-9]{32}$/,
  };

  const pattern = patterns[provider.toUpperCase()];
  if (pattern && !pattern.test(apiKey)) {
    return {
      valid: false,
      error: `Invalid ${provider} API key format`,
    };
  }

  return { valid: true };
};