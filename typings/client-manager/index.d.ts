import { ClientOptions, ClientState } from './interfaces';
export default class ClientJWTSessionManager {
    state: ClientState;
    clientOptions: ClientOptions;
    constructor(options: ClientOptions, restoreState?: ClientState);
    setState: (newState: ClientState) => void;
    getSessionRequestToken: () => Promise<void>;
    get sessionToken(): string;
    getSession: () => Promise<void>;
    closeSession: () => Promise<void>;
}
