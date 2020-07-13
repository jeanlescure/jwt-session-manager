import {
  ClientInitOptions, ClientState
} from './interfaces';

export default class ClientJWTSessionManager {
  state: ClientState = {};

  clientOptions: ClientInitOptions = {
    getSessionRequestTokenHandler: async () => '',
    requestSessionHandler: async () => '',
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
    && storeSessionRequestTokenHandler(this.state.sessionRequestToken);
  }

  requestSession = async () => {
    const {
      clientOptions,
      getSessionRequestToken,
      setState,
    } = this;

    const {
      requestSessionHandler,
      storeSessionTokenHandler,
    } = clientOptions;

    await getSessionRequestToken();

    const sessionToken = await requestSessionHandler(this.state.sessionRequestToken);

    setState({
      sessionToken,
    });

    storeSessionTokenHandler
    && storeSessionTokenHandler(this.state.sessionToken);
  }
};
