export type AiProvider = 'gemini' | 'openai';

const ACTIVE_PROVIDER_KEY = 'wfc-active-provider';
const GEMINI_API_KEY = 'wfc-gemini-api-key';
const OPENAI_API_KEY = 'wfc-openai-api-key';

export const apiKeyManager = {
  getActiveProvider: (): AiProvider => {
    return (localStorage.getItem(ACTIVE_PROVIDER_KEY) as AiProvider) || 'gemini';
  },

  setActiveProvider: (provider: AiProvider): void => {
    localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
  },

  getApiKey: (provider: AiProvider): string | null => {
    // Per guidelines, Gemini API key is from environment variables and is assumed to be present.
    if (provider === 'gemini') {
        return process.env.API_KEY || null;
    }
    // For other providers like openai, get from local storage.
    return localStorage.getItem(OPENAI_API_KEY);
  },

  setApiKey: (provider: AiProvider, key: string): void => {
    // Per guidelines, Gemini API key is not user-configurable.
    if (provider === 'gemini') {
      // This is a no-op for Gemini. We can also remove any old keys from storage for hygiene.
      localStorage.removeItem(GEMINI_API_KEY);
      console.warn("Attempted to set Gemini API key via UI. This is not supported.");
      return;
    }
    const storageKey = OPENAI_API_KEY;
    if (key) {
      localStorage.setItem(storageKey, key);
    } else {
      localStorage.removeItem(storageKey);
    }
  },

  // A helper to get the key for the currently active provider
  getActiveApiKey: (): string | null => {
    const provider = apiKeyManager.getActiveProvider();
    return apiKeyManager.getApiKey(provider);
  }
};
