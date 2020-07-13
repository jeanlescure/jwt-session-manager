import {
  ClientInitOptions, ClientState
} from './interfaces';

export default class ClientJWTSessionManager {
  state: ClientState = {};

  clientOptions: ClientInitOptions = {
    getSessionRequestTokenHandler: async () => {},
  };

  constructor(options: ClientInitOptions, restoreState?: ClientState) {
    this.clientOptions = {
      ...this.clientOptions,
      ...options,
    };

    if (restoreState) {
      this.state = {
        ...this.state,
        ...restoreState,
      }
    }
  }

  setState(newState: ClientState) {
    this.state = {
      ...this.state,
      ...newState,
    }
  };

  async getSessionRequestToken() {
    const {
      getSessionRequestTokenHandler,
    } = this.clientOptions;

    const requestTokenResponse = await getSessionRequestTokenHandler();

    this.setState({
      sessionRequestToken: requestTokenResponse,
    });
  }
};
