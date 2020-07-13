export interface ClientInitOptions {
  getSessionRequestTokenHandler: () => Promise<string>;
  requestSessionHandler: (sessionRequestToken: string) => Promise<string>;
  storeSessionRequestTokenHandler?: (sessionRequestToken: string) => Promise<void>;
}

export interface ClientState {
  sessionRequestToken?: string;
  sessionToken?: string;
}
