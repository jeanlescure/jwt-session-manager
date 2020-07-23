export interface ServerOptions {
    validateRequestHandler: (validationData: any) => Promise<boolean>;
    storeSessionKeyHandler: (sessionKey: string, validationData?: any) => Promise<string>;
    validateSessionKeyInStoreHandler: (sessionKey: string, extraValidationData?: any) => Promise<boolean>;
    jwtSecret?: string;
    autoGenerateSecret?: boolean;
    storeJWTSecretHandler?: (jwtSecret: string) => Promise<void>;
}
