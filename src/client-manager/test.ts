import * as jwt from 'jsonwebtoken';
import ClientJWTSessionManager from './';
import {ClientState} from './interfaces';

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

const mockInvalidRestoreState: ClientState = {
  sessionRequestToken: jwt.sign({
    exp: Math.floor(Date.now() / 1000) - 30,
    data: 'invalid'
  }, 'secret'),
};

test('can ask for session request token', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    getSessionHandler: async () => '',
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
    getSessionHandler: async () => '',
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
    getSessionHandler: async () => mockSessionToken,
  });

  await clientSessionManager.getSession();

  const decodedRequestToken: {data: string} = jwt.verify(clientSessionManager.state.sessionRequestToken, 'secret') as {
    data: string;
    exp: number;
  };

  expect(decodedRequestToken.data).toBe('foobar');

  const decodedSessionToken: {data: string} = jwt.verify(clientSessionManager.sessionToken, 'secret') as {
    data: string;
  };

  expect(decodedSessionToken.data).toBe('success');
});

test('can request a session while using external store', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    getSessionHandler: async (sessionRequestToken: string) => {
      const decodedRequestToken: {data: string} = jwt.verify(sessionRequestToken, 'secret') as {
        data: string;
        exp: number;
      };

      expect(decodedRequestToken.data).toBe('foobar');

      return mockSessionToken;
    },
    storeSessionRequestTokenHandler: async (sessionRequestToken) => {
      return new Promise((resolve, reject) => {
        mockStore.sessionRequestToken = sessionRequestToken;
        resolve();
      });
    },
    storeSessionTokenHandler: async (sessionToken) => {
      return new Promise((resolve, reject) => {
        mockStore.sessionToken = sessionToken;
        resolve();
      });
    },
  });

  await clientSessionManager.getSession();

  const decodedSessionToken: {data: string} = jwt.verify(mockStore.sessionToken, 'secret') as {
    data: string;
  };

  expect(decodedSessionToken.data).toBe('success');
});

test('can request a session with invalid restored sessionRequestToken', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    getSessionHandler: async (sessionRequestToken: string) => {
      const decodedRequestToken: {data: string} = jwt.verify(sessionRequestToken, 'secret') as {
        data: string;
        exp: number;
      };

      expect(decodedRequestToken.data).toBe('foobar');

      return mockSessionToken;
    },
    storeSessionRequestTokenHandler: async (sessionRequestToken) => {
      return new Promise((resolve, reject) => {
        mockStore.sessionRequestToken = sessionRequestToken;
        resolve();
      });
    },
    storeSessionTokenHandler: async (sessionToken) => {
      return new Promise((resolve, reject) => {
        mockStore.sessionToken = sessionToken;
        resolve();
      });
    },
  }, mockInvalidRestoreState);

  await clientSessionManager.getSession();

  const decodedSessionToken: {data: string} = jwt.verify(mockStore.sessionToken, 'secret') as {
    data: string;
  };

  expect(decodedSessionToken.data).toBe('success');
});

test('can restore sessionToken from external store', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    getSessionHandler: async () => mockSessionToken,
  });

  await clientSessionManager.getSession();

  const restoredSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    getSessionHandler: async () => mockSessionToken,
  }, {
    sessionToken: clientSessionManager.sessionToken,
  });

  const decodedSessionToken: {data: string} = jwt.verify(restoredSessionManager.sessionToken, 'secret') as {
    data: string;
  };

  expect(decodedSessionToken.data).toBe('success');
});

test('can request to close session', async () => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
    getSessionHandler: async () => '',
    closeSessionHandler: async (sessionToken: string) => {
      const decodedSessionToken: {data: string} = jwt.verify(sessionToken, 'secret') as {
        data: string;
      };

      expect(decodedSessionToken.data).toBe('success');
    },
  }, {
    sessionToken: mockSessionToken,
  });

  await clientSessionManager.closeSession();

  expect(() => jwt.verify(clientSessionManager.sessionToken, 'secret')).toThrow('jwt must be provided');
  expect(clientSessionManager.sessionToken).toBeNull();
});
