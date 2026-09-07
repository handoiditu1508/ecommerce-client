export {};

declare global {
  interface FacebookAuthResponse {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
  }

  interface FacebookLoginStatusResponse {
    status: "connected" | "not_authorized" | "unknown";
    authResponse: FacebookAuthResponse | null;
  }

  interface FacebookSdk {
    init: (config: {
      appId: string;
      cookie?: boolean;
      xfbml?: boolean;
      version: string;
    }) => void;
    login: (
      callback: (response: FacebookLoginStatusResponse) => void,
      options?: { scope?: string; }
    ) => void;
    api: <T>(
      path: string,
      params: Record<string, unknown>,
      callback: (response: T) => void
    ) => void;
  }

  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}
