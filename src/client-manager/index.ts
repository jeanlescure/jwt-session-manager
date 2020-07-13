import {
  ClientInitOptions, ClientState
} from './interfaces';

export default class ClientJWTSessionManager {
  state: ClientState = {
    sessionToken: null,
  };

  clientOptions: ClientInitOptions = {
    getSessionRequestTokenHandler: async () => '',
    getSessionHandler: async () => '',
  };

  constructor(options: ClientInitOptions, restoreState?: ClientState) {
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

  getSessionRequestToken = async () => {
    const {
      clientOptions,
      setState,
    } = this;

    const {
      getSessionRequestTokenHandler,
      storeSessionRequestTokenHandler,
    } = clientOptions;

    const requestTokenResponse = await getSessionRequestTokenHandler();

    setState({
      sessionRequestToken: requestTokenResponse,
    });

    storeSessionRequestTokenHandler
    && await storeSessionRequestTokenHandler(this.state.sessionRequestToken);
  };

  get sessionToken(): string {
    return this.state.sessionToken;
  };

  getSession = async () => {
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
      await getSessionRequestToken();

      return await getSessionHandler(this.state.sessionRequestToken);
    });

    setState({
      sessionToken
    });

    storeSessionTokenHandler
    && await storeSessionTokenHandler(this.sessionToken);
  };

  closeSession = async () => {
    const {
      clientOptions,
      setState,
    } = this;

    const {
      closeSessionHandler,
    } = clientOptions;

    closeSessionHandler
    && await closeSessionHandler(this.sessionToken);

    setState({
      sessionToken: null,
    });
  };
};
