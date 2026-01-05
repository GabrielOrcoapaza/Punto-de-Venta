export {};

declare global {
  interface Window {
    electronAPI: {
      saveToken: (token: string) => void;
      loadToken: () => Promise<string | null>;
      clearToken: () => void;

      // 🆕 JWT
      saveRefreshToken: (token: string) => void;
      loadRefreshToken: () => Promise<string | null>;
      clearRefreshToken: () => void;
    };
  }
}