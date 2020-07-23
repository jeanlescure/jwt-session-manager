import { ServerOptions } from './interfaces';
export default class ServerJWTSessionManager {
    serverOptions: ServerOptions;
    jwtSecretStorePromise: Promise<ServerJWTSessionManager>;
    get jwtSecret(): string;
    generateSecret: () => string;
    constructor(options: ServerOptions);
    generateSessionRequestToken: (expirySeconds?: number) => string;
    checkSessionRequestToken: (sessionRequestToken: string) => boolean;
    generateSessionToken: (sessionKey: string | null) => string;
    processSessionRequest: (sessionRequestToken: string, validationData: any) => Promise<string | null>;
    checkSessionToken: (sessionToken: string, extraValidationData?: any) => Promise<boolean>;
}
