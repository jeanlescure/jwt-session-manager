import * as jwt from 'jsonwebtoken';
import ClientJWTSessionManager from './';

const mockRequestToken = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');

test('can ask for session request token', async() => {
  const clientSessionManager = new ClientJWTSessionManager({
    getSessionRequestTokenHandler: async () => {
      return new Promise((resolve, reject) => resolve(mockRequestToken));
    },
  });

  expect(clientSessionManager.sessionRequestToken).toBeUndefined();

  await clientSessionManager.getSessionRequestToken();

  jwt.verify(clientSessionManager.sessionRequestToken, 'secret');
});
