export interface ClientInitOptions {
  getSessionRequestTokenHandler: Function;
}

export interface ClientState {
  sessionRequestToken?: string;
}
