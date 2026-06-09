// src/services/storage.ts
// SecureStore wrapper — persists JWT token and farmer_id across app restarts
// Uses expo-secure-store which encrypts data using the device keychain

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY    = 'mdumeni_auth_token';
const FARMER_KEY   = 'mdumeni_farmer_id';
const PUSH_KEY     = 'mdumeni_push_token';

export const TokenStorage = {
  async save(token: string, farmerId: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY,  token);
    await SecureStore.setItemAsync(FARMER_KEY, farmerId);
  },

  async load(): Promise<{ token: string; farmerId: string } | null> {
    const token    = await SecureStore.getItemAsync(TOKEN_KEY);
    const farmerId = await SecureStore.getItemAsync(FARMER_KEY);
    if (token && farmerId) return { token, farmerId };
    return null;
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(FARMER_KEY);
  },

  async savePushToken(pushToken: string): Promise<void> {
    await SecureStore.setItemAsync(PUSH_KEY, pushToken);
  },

  async loadPushToken(): Promise<string | null> {
    return SecureStore.getItemAsync(PUSH_KEY);
  },
};
