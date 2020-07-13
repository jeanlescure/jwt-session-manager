import path from 'path';
require('dotenv').config({path: process.env.DOTENV_CONFIG_PATH || path.resolve(process.cwd(), '.env')});

import {ServerOptions} from './interfaces';

export default class ServerJWTSessionManager {
  serverOptions: ServerOptions = {};

  constructor(options?: ServerOptions) {
    const envOptions: ServerOptions = {
      secret: process.env.SESSION_MANAGER_SECRET,
    };

    this.serverOptions = {
      ...this.serverOptions,
      ...envOptions,
      ...options,
    };
  }

  get secret(): string {
    return this.serverOptions.secret;
  }
};
