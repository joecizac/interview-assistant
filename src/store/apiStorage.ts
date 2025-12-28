import type { StateStorage } from 'zustand/middleware';
import { api } from '../lib/api';

const debounce = (fn: Function, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const apiStorage: StateStorage = {
  getItem: async (_name: string): Promise<string | null> => { // Changed name to _name
    try {
      const data = await api.load();
      // If server returns empty or default, ensure it matches what persist expects
      // We assume server returns the full object { state: ..., version: ... }
      // But if it's the first run, server returns { state: { platforms: [], ... }, version: 0 }
      return JSON.stringify(data);
    } catch (error) {
      console.error('Storage read error:', error);
      return null;
    }
  },

  setItem: debounce(async (_name: string, value: string) => { // Changed name to _name
    try {
      const data = JSON.parse(value);
      await api.save(data);
    } catch (error) {
      console.error('Storage write error:', error);
    }
  }, 1000), // 1 second debounce to avoid flooding the server

  removeItem: async (_name: string) => { // Changed name to _name
    // We probably don't want to delete the DB on logout, but for compliance:
    console.warn('removeItem called on apiStorage - ignoring');
  },
};
