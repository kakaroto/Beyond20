/// <reference types="vite/client" />

// Minimal ambient declaration for WebExtension runtime APIs
declare const chrome: {
  runtime?: {
    getURL?: (path: string) => string;
    sendMessage?: (message: unknown, callback?: (response: unknown) => void) => void;
    openOptionsPage?: () => void;
  };
  storage?: {
    local: {
      get: (keys: unknown, callback: (items: Record<string, unknown>) => void) => void;
      set: (items: Record<string, unknown>, callback?: () => void) => void;
    };
  };
  tabs?: {
    query: (queryInfo: unknown, callback: (tabs: unknown[]) => void) => void;
    sendMessage: (
      tabId: number,
      message: unknown,
      options: unknown,
      callback?: (response: unknown) => void
    ) => void;
  };
  windows?: {
    create: (createData: {
      url: string;
      type?: "normal" | "popup" | "panel";
      width?: number;
      height?: number;
    }) => void;
  };
};
