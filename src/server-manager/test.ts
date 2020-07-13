import ServerJWTSessionManager from './';

const customSecret = 'muchLessSecureTestSecret';

const mockStore: {
  [key: string]: any,
} = {};

test('can load secret from env vars', async () => {
  const serverSessionManager = new ServerJWTSessionManager();

  expect(serverSessionManager.secret).toBe('thisIs1TestSecret!whichIncludes$p#c!@|ch@rs');
});

test('can be instantiated with custom secret', () => {
  const serverSessionManager = new ServerJWTSessionManager({
    secret: customSecret,
  });

  expect(serverSessionManager.secret).toBe(customSecret);
});

test('can generate safe unique secrets', () => {
  // This test has an approximate probability of failing of
  // 1 in 1,730,418,915,111,425,280,952,848,056,848,216,368,208,136,360,064,800,224,464,872,000
  const serverSessionManager = new ServerJWTSessionManager({
    secret: customSecret,
  });
  
  const firstSecret = serverSessionManager.generateSecret();

  expect(firstSecret.length).toBe(64);

  const secondSecret = serverSessionManager.generateSecret();

  expect(secondSecret.length).toBe(64);

  expect(firstSecret).not.toBe(secondSecret);
});

test('by default will generate safe unique secret if instantiated with invalid secret', () => {
  const serverSessionManager = new ServerJWTSessionManager({
    secret: null,
  });

  expect(serverSessionManager.secret).not.toBeNull();
  expect(serverSessionManager.secret.length).toBe(64);
});

test('will throw if instantiated with invalid secret and autoGenerateSecret false', () => {
  expect(() => new ServerJWTSessionManager({
    secret: null,
    autoGenerateSecret: false,
  })).toThrow('Invalid Secret!');
});

test('can store secret upon instantiation', async () => {
  const serverSessionManager = new ServerJWTSessionManager({
    storeSecretHandler: async (secret: string) => {
      mockStore.secret = secret;
    },
  });

  serverSessionManager.secretStorePromise.then(() => {
    expect(mockStore.secret).toBe('thisIs1TestSecret!whichIncludes$p#c!@|ch@rs');
  }); 
});

test('can generate session request token (which expires) and verify it', (done) => {
  const serverSessionManager = new ServerJWTSessionManager();

  const twoMinToken = serverSessionManager.generateSessionRequestToken();

  expect(serverSessionManager.checkSessionRequestToken(twoMinToken)).toBe(true);

  const oneSecToken = serverSessionManager.generateSessionRequestToken(1);

  setTimeout(() => {
    expect(serverSessionManager.checkSessionRequestToken(oneSecToken)).toBe(false);
    done();
  }, 1100);
});
