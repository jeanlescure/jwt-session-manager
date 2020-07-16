import {
  ClientOptions, ClientState
} from './interfaces';

export default class ClientJWTSessionManager {
  state: ClientState = {
    sessionToken: null,
  };

  clientOptions: ClientOptions = {
    getSessionRequestTokenHandler: async () => '',
    getSessionHandler: async () => '',
  };

  constructor(options: ClientOptions, restoreState?: ClientState) {
    this.clientOptions = {
      ...this.clientOptions,
      ...options,
    };

    restoreState
    && this.setState(restoreState);
  }

  setState = (newState: ClientState) => {
    const prevState: ClientState = this.state;

    this.state = {
      ...prevState,
      ...newState,
    };
  };

  getSessionRequestToken = async (): Promise<void> => {
    const {
      clientOptions,
      setState,
    } = this;

    const {
      getSessionRequestTokenHandler,
      storeSessionRequestTokenHandler,
    } = clientOptions;

    const requestTokenResponse = await getSessionRequestTokenHandler().catch((e) => {throw e;});

    setState({
      sessionRequestToken: requestTokenResponse,
    });

    storeSessionRequestTokenHandler
    && await storeSessionRequestTokenHandler(this.state.sessionRequestToken).catch((e) => {throw e;});

    return;
  };

  get sessionToken(): string {
    return this.state.sessionToken;
  };

  getSession = async (): Promise<void> => {
    const {
      clientOptions,
      getSessionRequestToken,
      setState,
    } = this;

    const {
      getSessionHandler,
      storeSessionTokenHandler,
    } = clientOptions;

    if (!this.state.sessionRequestToken) {
      await getSessionRequestToken();
    }

    const sessionToken = await getSessionHandler(this.state.sessionRequestToken).catch(async (error) => {
      if (error.name !== 'TokenExpiredError') {
        throw error;
      }

      // If token is expired simply retry once as it may be an invalid stored token
      await getSessionRequestToken().catch((e) => {throw e;});

      return await getSessionHandler(this.state.sessionRequestToken).catch((e) => {throw e;});
    }).catch((e) => {throw e;});

    setState({
      sessionToken
    });

    storeSessionTokenHandler
    && await storeSessionTokenHandler(this.sessionToken).catch((e) => {throw e;});

    return;
  };

  closeSession = async (): Promise<void> => {
    const {
      clientOptions,
      setState,
    } = this;

    const {
      closeSessionHandler,
    } = clientOptions;

    closeSessionHandler
    && await closeSessionHandler(this.sessionToken).catch((e) => {throw e;});

    setState({
      sessionToken: null,
    });

    return;
  };
};
