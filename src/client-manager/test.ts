import * as jwt from 'jsonwebtoken';
import ClientJWTSessionManager from './';

const mockRequestToken: string = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');

const mockSessionToken: string = jwt.sign({
  data: 'success'
}, 'secret');

const mockStore: {
  [key: string]: any
} = {};

test('can ask for session request token', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    requestSessionHandler: async () => '',
  });

  expect(clientSessionManager.state.sessionRequestToken).toBeUndefined();

  await clientSessionManager.getSessionRequestToken();

  jwt.verify(clientSessionManager.state.sessionRequestToken, 'secret');
});

test('can ask for session request token and add it to external store', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    requestSessionHandler: async () => '',
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

test('can request a session', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    requestSessionHandler: async () => mockSessionToken,
  });

  await clientSessionManager.requestSession();

  const decodedRequestToken: {data: string} = jwt.verify(clientSessionManager.state.sessionRequestToken, 'secret') as {
    data: string;
    exp: number;
  };

  expect(decodedRequestToken.data).toBe('foobar');

  const decodedSessionToken: {data: string} = jwt.verify(clientSessionManager.state.sessionToken, 'secret') as {
    data: string;
  };

  expect(decodedSessionToken.data).toBe('success');
});
