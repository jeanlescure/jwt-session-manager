export interface ServerOptions {
  validateRequestHandler: (validationData: any) => Promise<boolean>;
  storeSessionKeyHandler: (sessionKey: string) => Promise<string>;
  validateSessionKeyInStoreHandler: (sessionKey: string, extraValidationData?: any) => Promise<boolean>;
  secret?: string;
  autoGenerateSecret?: boolean;
  storeSecretHandler?: (secret: string) => Promise<void>;
}
