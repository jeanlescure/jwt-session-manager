export interface ClientInitOptions {
  getSessionRequestTokenHandler: () => Promise<string>;
  getSessionHandler: (sessionRequestToken: string) => Promise<string>;
  closeSessionHandler?: (sessionToken: string) => Promise<void>;
  storeSessionRequestTokenHandler?: (sessionRequestToken: string) => Promise<void>;
  storeSessionTokenHandler?: (sessionToken: string) => Promise<void>;
}

export interface ClientState {
  sessionRequestToken?: string;
  sessionToken?: string | null;
}
