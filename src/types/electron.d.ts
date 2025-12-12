export {};

declare global {
  interface Window {
    electronAPI: {
      saveToken: (token: string) => void;
      loadToken: () => Promise<string | null>;
      clearToken: () => void;
    };
  }
}