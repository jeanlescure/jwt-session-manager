import * as jwt from 'jsonwebtoken';
import ClientJWTSessionManager from './';

const mockRequestToken: string = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');

const mockStore: {
  [key: string]: any
} = {};

test('can ask for session request token', async() => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
  });

  expect(clientSessionManager.state.sessionRequestToken).toBeUndefined();

  await clientSessionManager.getSessionRequestToken();

  jwt.verify(clientSessionManager.state.sessionRequestToken, 'secret');
});

test('can ask for session request token and add it to external store', async() => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    storeSessionRequestTokenHandler: async (sessionRequestToken) => {
      return new Promise((resolve, reject) => {
        mockStore.sessionRequestToken = sessionRequestToken;
        resolve();
      });
    },
  });

  expect(clientSessionManager.state.sessionRequestToken).toBeUndefined();

  await clientSessionManager.getSessionRequestToken();

  jwt.verify(mockStore.sessionRequestToken, 'secret');
});
