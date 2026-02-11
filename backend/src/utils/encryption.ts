import CryptoJS from 'crypto-js';
import { config } from '../config';

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, config.encryptionKey).toString();
};

export const decrypt = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, config.encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hash);
};
