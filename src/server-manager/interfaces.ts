export interface ServerOptions {
  secret?: string;
  autoGenerateSecret?: boolean;
  storeSecretHandler?: (secret: string) => Promise<void>;
}
