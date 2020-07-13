export interface ClientInitOptions {
  getSessionRequestTokenHandler: Function;
  storeSessionRequestTokenHandler?: (sessionRequestToken: string) => Promise<void>;
}

export interface ClientState {
  sessionRequestToken?: string;
}
