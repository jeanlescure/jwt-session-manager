import {ClientInitOptions} from './interfaces';

export default class ClientJWTSessionManager {
  sessionRequestToken: string;
  clientOptions: ClientInitOptions = {
    getSessionRequestTokenHandler: async () => {},
  };

  constructor(options: ClientInitOptions) {
    this.clientOptions = {
      ...this.clientOptions,
      ...options,
    };
  }

  async getSessionRequestToken() {
    const {
      getSessionRequestTokenHandler,
    } = this.clientOptions;

    const requestTokenResponse = await getSessionRequestTokenHandler();

    this.sessionRequestToken = requestTokenResponse;
  }
};
