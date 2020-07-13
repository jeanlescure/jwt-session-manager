import ServerJWTSessionManager from './';

test('can load secret from env vars', async () => {
  const serverSessionManager = new ServerJWTSessionManager();

  expect(serverSessionManager.secret).toBe('thisIs1TestSecret!whichIncludes$p#c!@|ch@rs');
});