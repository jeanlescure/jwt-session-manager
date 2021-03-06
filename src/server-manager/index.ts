import path from 'path';
require('dotenv').config({path: process.env.DOTENV_CONFIG_PATH || path.resolve(process.cwd(), '.env')});

import ShortUniqueId from 'short-unique-id';
import * as jwt from 'jsonwebtoken';

import {
  ServerOptions,
  SessionObject,
} from './interfaces';

let idDict = new Array(94);
for (let i = 93; i >= 0; i -= 1) idDict[i] = String.fromCharCode(i + 33);
const uid = new ShortUniqueId({
  dictionary: idDict,
  length: 64,
});

export default class ServerJWTSessionManager {
  serverOptions: ServerOptions = {
    autoGenerateSecret: true,
    validateRequestHandler: async (validationData: any) => false,
    storeSessionKeyHandler: async (sessionKey: string) => '',
    validateSessionKeyInStoreHandler: async () => false,
  };

  jwtSecretStorePromise: Promise<ServerJWTSessionManager>;

  get jwtSecret(): string {
    return this.serverOptions.jwtSecret;
  }

  generateSecret = (): string => {
    // With the provided dictionary and given the 64 character length,
    // this library can generate this amount of unique secrets:
    // 1,906,262,174,603,609,088,576,616,448,880,496,376,736,472,440,472,536,824,976,488,112,704,264,624,800,304,704,624,848,640,656,728,592,472,800,216,888,232,600,112,440,440
    // (one unquadragintillion nine hundred six quadragintillion two hundred sixty-two novemtrigintillion one hundred seventy-four octotrigintillion six hundred three septentrigintillion six hundred nine sextrigintillion eighty-eight quintrigintillion five hundred seventy-six quattuortrigintillion six hundred sixteen trestrigintillion four hundred forty-eight duotrigintillion eight hundred eighty untrigintillion four hundred ninety-six trigintillion three hundred seventy-six novemvigintillion seven hundred thirty-six octovigintillion four hundred seventy-two septenvigintillion four hundred forty sexvigintillion four hundred seventy-two quinvigintillion five hundred thirty-six quattuorvigintillion eight hundred twenty-four trevigintillion nine hundred seventy-six duovigintillion four hundred eighty-eight unvigintillion one hundred twelve vigintillion seven hundred four novemdecillion two hundred sixty-four octodecillion six hundred twenty-four septendecillion eight hundred sexdecillion three hundred four quindecillion seven hundred four quattuordecillion six hundred twenty-four tredecillion eight hundred forty-eight duodecillion six hundred forty undecillion six hundred fifty-six decillion seven hundred twenty-eight nonillion five hundred ninety-two octillion four hundred seventy-two septillion eight hundred sextillion two hundred sixteen quintillion eight hundred eighty-eight quadrillion two hundred thirty-two trillion six hundred billion one hundred twelve million four hundred forty thousand four hundred forty)
    //
    // This means the approximate probability of duplicate secrets being generetade is of
    // 1 in 1,730,418,915,111,425,280,952,848,056,848,216,368,208,136,360,064,800,224,464,872,000
    return uid();
  };

  constructor(options: ServerOptions) {
    const envOptions: ServerOptions = {
      ...this.serverOptions,
      jwtSecret: process.env.SESSION_MANAGER_SECRET,
    };

    this.serverOptions = {
      ...envOptions,
      ...options,
    };

    if (!this.serverOptions.jwtSecret && this.serverOptions.autoGenerateSecret) {
      this.serverOptions.jwtSecret = this.generateSecret();
    } else if (!this.serverOptions.autoGenerateSecret) {
      throw new Error('Invalid Secret!');
    }

    this.serverOptions.storeJWTSecretHandler
    && (
      this.jwtSecretStorePromise = (async (): Promise<ServerJWTSessionManager>  => {
        await this.serverOptions.storeJWTSecretHandler(this.jwtSecret);

        return this;
      })()
    );
  }

  generateSessionRequestToken = (expirySeconds: number = 60 * 2): string => {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + expirySeconds,
    }, this.jwtSecret);
  };

  checkSessionRequestToken = (sessionRequestToken: string): boolean => {
    try {
      jwt.verify(sessionRequestToken, this.jwtSecret);
      return true;
    } catch(e) {
      return false;
    }
  };

  generateSessionToken = (sessionKey: string | null, sessionData?: any) => {
    return (
      !sessionKey && null
    ) || jwt.sign({
      sessionKey,
      sessionData,
    }, this.jwtSecret);
  };

  processSessionRequest = async (
    sessionRequestToken: string,
    validationData: any,
    sessionData?: any,
  ): Promise<string | null> => {
    const {
      checkSessionRequestToken,
      generateSecret,
      generateSessionToken,
      serverOptions,
    } = this;

    const {
      validateRequestHandler,
      storeSessionKeyHandler,
    } = serverOptions;

    return (
      checkSessionRequestToken(sessionRequestToken)
      && await validateRequestHandler(validationData)
      && generateSessionToken(
        await storeSessionKeyHandler(generateSecret(), validationData).catch((e) => null),
        sessionData,
      )
    ) || null;
  };

  checkSessionToken = async (sessionToken: string, extraValidationData?: any): Promise<boolean> => {
    try {
      const {
        validateSessionKeyInStoreHandler,
      } = this.serverOptions;

      const {sessionKey} = jwt.verify(sessionToken, this.jwtSecret) as SessionObject;

      return await validateSessionKeyInStoreHandler(sessionKey, extraValidationData)
    } catch (e) {
      return false;
    }
  };

  dataFromSessionToken = async (sessionToken: string, extraValidationData?: any): Promise<any> => {
    if (this.checkSessionToken(sessionToken, extraValidationData)) {
      const {sessionData} = jwt.verify(sessionToken, this.jwtSecret) as SessionObject;

      return sessionData || null;
    }

    return null;
  };
};
