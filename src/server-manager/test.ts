import * as jwt from 'jsonwebtoken';

import ServerJWTSessionManager from './';

const customSecret = 'muchLessSecureTestSecret';

const mockStore: {
  [key: string]: any,
} = {
  users: [
    {
      username: 'korbendallas',
      password: 'multipass',
      sessionKey: null,
    },
  ],
};

const mockInvalidSessionToken = jwt.sign({
  data: 'invalid'
}, 'secret');


const mockValidateRequestHandler = async (validationData: any) => true;
const mockStoreSessionKeyHandler = async (sessionKey: string) => '';
const mockValidateSessionKeyInStoreHandler = async (sessionKey: string, extraValidationData: any) => true;

test('can load secret from env vars', async () => {
  const serverSessionManager = new ServerJWTSessionManager({
    validateRequestHandler: mockValidateRequestHandler,
    storeSessionKeyHandler: mockStoreSessionKeyHandler,
    validateSessionKeyInStoreHandler: mockValidateSessionKeyInStoreHandler,
  });

  expect(serverSessionManager.jwtSecret).toBe('thisIs1TestSecret!whichIncludes$p#c!@|ch@rs');
});

test('can be instantiated with custom secret', () => {
  const serverSessionManager = new ServerJWTSessionManager({
    jwtSecret: customSecret,
    validateRequestHandler: mockValidateRequestHandler,
    storeSessionKeyHandler: mockStoreSessionKeyHandler,
    validateSessionKeyInStoreHandler: mockValidateSessionKeyInStoreHandler,
  });

  expect(serverSessionManager.jwtSecret).toBe(customSecret);
});

test('can generate safe unique secrets', () => {
  // This test has an approximate probability of failing of
  // 1 in 1,730,418,915,111,425,280,952,848,056,848,216,368,208,136,360,064,800,224,464,872,000
  const serverSessionManager = new ServerJWTSessionManager({
    jwtSecret: customSecret,
    validateRequestHandler: mockValidateRequestHandler,
    storeSessionKeyHandler: mockStoreSessionKeyHandler,
    validateSessionKeyInStoreHandler: mockValidateSessionKeyInStoreHandler,
  });
  
  const firstSecret = serverSessionManager.generateSecret();

  expect(firstSecret.length).toBe(64);

  const secondSecret = serverSessionManager.generateSecret();

  expect(secondSecret.length).toBe(64);

  expect(firstSecret).not.toBe(secondSecret);
});

test('by default will generate safe unique secret if instantiated with invalid secret', () => {
  const serverSessionManager = new ServerJWTSessionManager({
    jwtSecret: null,
    validateRequestHandler: mockValidateRequestHandler,
    storeSessionKeyHandler: mockStoreSessionKeyHandler,
    validateSessionKeyInStoreHandler: mockValidateSessionKeyInStoreHandler,
  });

  expect(serverSessionManager.jwtSecret).not.toBeNull();
  expect(serverSessionManager.jwtSecret.length).toBe(64);
});

test('will throw if instantiated with invalid secret and autoGenerateSecret false', () => {
  expect(() => new ServerJWTSessionManager({
    jwtSecret: null,
    autoGenerateSecret: false,
    validateRequestHandler: mockValidateRequestHandler,
    storeSessionKeyHandler: mockStoreSessionKeyHandler,
    validateSessionKeyInStoreHandler: mockValidateSessionKeyInStoreHandler,
  })).toThrow('Invalid Secret!');
});

test('can store secret upon instantiation', async () => {
  const serverSessionManager = new ServerJWTSessionManager({
    storeJWTSecretHandler: async (jwtSecret: string) => {
      mockStore.jwtSecret = jwtSecret;
    },
    validateRequestHandler: mockValidateRequestHandler,
    storeSessionKeyHandler: mockStoreSessionKeyHandler,
    validateSessionKeyInStoreHandler: mockValidateSessionKeyInStoreHandler,
  });

  serverSessionManager.jwtSecretStorePromise.then(() => {
    expect(mockStore.jwtSecret).toBe('thisIs1TestSecret!whichIncludes$p#c!@|ch@rs');
  }); 
});

test('can generate session request token (which expires) and verify it', (done) => {
  const serverSessionManager = new ServerJWTSessionManager({
    validateRequestHandler: mockValidateRequestHandler,
    storeSessionKeyHandler: mockStoreSessionKeyHandler,
    validateSessionKeyInStoreHandler: mockValidateSessionKeyInStoreHandler,
  });

  const twoMinToken = serverSessionManager.generateSessionRequestToken();

  expect(serverSessionManager.checkSessionRequestToken(twoMinToken)).toBe(true);

  const oneSecToken = serverSessionManager.generateSessionRequestToken(1);

  setTimeout(() => {
    expect(serverSessionManager.checkSessionRequestToken(oneSecToken)).toBe(false);
    done();
  }, 1100);
});

test('can process a session request and validate a session', async () => {
  const serverSessionManager = new ServerJWTSessionManager({
    validateRequestHandler: async (validationData: any) => {
      return (
        mockStore.users[0].username === validationData.username
        && mockStore.users[0].password === validationData.password
      );
    },
    storeSessionKeyHandler: async (sessionKey: string) => {
      mockStore.users[0].sessionKey = sessionKey;

      return sessionKey;
    },
    validateSessionKeyInStoreHandler: async (sessionKey: string, extraValidationData: any): Promise<boolean> => {
      return new Promise((resolve, reject) => resolve(
        sessionKey === mockStore.users[0].sessionKey
        && extraValidationData.username === mockStore.users[0].username
      ))
    },
  });

  const twoMinToken = serverSessionManager.generateSessionRequestToken();

  const validData = {
    username: 'korbendallas',
    password: 'multipass',
  };

  const sessionToken = await serverSessionManager.processSessionRequest(twoMinToken, validData);

  expect(typeof mockStore.users[0].sessionKey).toBe('string');
  expect(mockStore.users[0].sessionKey.length).toBe(64);

  const {data} = jwt.verify(sessionToken, serverSessionManager.jwtSecret) as {data: any};

  expect(data).toBe(mockStore.users[0].sessionKey);

  const validSession = await serverSessionManager.checkSessionToken(
    sessionToken,
    {
      username: 'korbendallas',
    },
  );

  expect(validSession).toBe(true);

  const invalidData = {
    username: 'korbendallas',
    password: 'jeanbabtisteemanuelzorg',
  };

  const failedRequest = await serverSessionManager.processSessionRequest(twoMinToken, invalidData);

  expect(failedRequest).toBeNull();

  const invalidSession = await serverSessionManager.checkSessionToken(
    mockInvalidSessionToken,
    {
      username: 'korbendallas',
    },
  );

  expect(invalidSession).toBe(false);
});
