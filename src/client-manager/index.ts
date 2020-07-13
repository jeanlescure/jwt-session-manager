import {
  ClientInitOptions, ClientState
} from './interfaces';

export default class ClientJWTSessionManager {
  sessionToken:string = '';
  state: ClientState = {};

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
    && storeSessionRequestTokenHandler(this.state.sessionRequestToken);
  }

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

    await getSessionRequestToken();

    const sessionToken = await getSessionHandler(this.state.sessionRequestToken);

    this.sessionToken = sessionToken;

    storeSessionTokenHandler
    && storeSessionTokenHandler(this.sessionToken);
  }
};
