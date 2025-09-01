const SESSION_STORAGE_KEY = 'AIzaSyBUf1QGu51VfitVMrQBI9w_4aREkazlSaE';

export const apiKeyManager = {
  getApiKey: (): string | null => {
    // Prefer the key from session storage if it exists.
    const sessionKey = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionKey) {
      return sessionKey;
    }
    // Fallback to environment variable.
    return process.env.API_KEY || null;
  },

  setApiKey: (key: string): void => {
    if (key) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, key);
    } else {
      // If the key is empty, clear it.
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  },
};
