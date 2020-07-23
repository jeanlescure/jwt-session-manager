const fs = require('fs');
const http = require('http');
const {parse} = require('querystring');
const leveldown = require('leveldown');
const encryptdown = require('@adorsys/encrypt-down');
const levelup = require('levelup');
const {ServerJWTSessionManager} = require('jwt-session-manager');

const jwk = {
  kty: 'oct',
  alg: 'A256GCM',
  use: 'enc',
  k: fs.readFileSync('.key'),
};

const localdb = leveldown('./store');
const db = levelup(encryptdown(localdb, { jwk }));

const storeJWTSecretHandler = async (jwtSecret) => {
  const storedSecret = await db.get('sessionSecret', {asBuffer: false}).catch((e) => null);

  !storedSecret
  && await db.put('sessionSecret', jwtSecret);
};

const validateRequestHandler = async ({username, password}) => {
  const users = await db.get('users', {asBuffer: false});

  return (users[username] || {}).password === password;
};

const storeSessionKeyHandler = async (sessionKey, {username}) => {
  const users = await db.get('users', {asBuffer: false});

  users[username].sessionKey = sessionKey;

  return await db.put('users', users).then(() => sessionKey).catch(() => null);
};

const validateSessionKeyInStoreHandler = async (sessionKey, {username}) => {
  const users = await db.get('users', {asBuffer: false});

  return (users[username] || {}).sessionKey === sessionKey;
};

const main = async () => {
  const sessionManager = new ServerJWTSessionManager({
    jwtSecret: await db.get('sessionSecret', {asBuffer: false}).catch((e) => null),
    storeJWTSecretHandler,
    validateRequestHandler,
    storeSessionKeyHandler,
    validateSessionKeyInStoreHandler,
  });

  await sessionManager.jwtSecretStorePromise.then(() => console.log(sessionManager.jwtSecret));

  const PORT = 8080;

  const handleNotFound = (request, response) => {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('NOT FOUND');
  };
  
  const handleNotAuthorized = (request, response) => {
    response.writeHead(401, {'Content-Type': 'text/plain'});
    response.end('NOT AUTHORIZED');
  };

  const routes = {
    '/request-token': (request, response) => {
      response.end(sessionManager.generateSessionRequestToken());
    },
    '/login': (request, response) => {
      if (request.method === 'POST') {
        let body = '';

        request.on('data', (chunk) => {
          body += chunk.toString();
        });

        request.on('end', async () => {
          const {
            requestToken,
            username,
            password,
          } = parse(body);

          const result = await sessionManager.processSessionRequest(requestToken, {
            username,
            password,
          });

          if (!result) {
            return handleNotAuthorized(request, response);
          }

          response.end(result);
        });
      } else {
        handleNotFound(request, response);
      }
    },
    '/logout': async (request, response) => {
      const sessionToken = request.headers['authorization'].replace(/^Bearer\s/, '');
      const username = request.headers['user'];

      const valid = await sessionManager.checkSessionToken(sessionToken, {username});

      if (!valid) {
        return handleNotAuthorized(request, response);
      }

      const users = await db.get('users', {asBuffer: false});

      const {
        sessionKey,
        ...loggetOutUserData
      } = users[username];

      users[username] = loggetOutUserData;

      await db.put('users', users);

      response.end('ok');
    },
    '/user': async (request, response) => {
      const sessionToken = request.headers['authorization'].replace(/^Bearer\s/, '');
      const username = request.headers['user'];

      const valid = await sessionManager.checkSessionToken(sessionToken, {username});

      if (!valid) {
        return handleNotAuthorized(request, response);
      }

      const users = await db.get('users', {asBuffer: false});

      const {
        sessionKey,
        password,
        ...safeUserData
      } = users[username];

      response.end(JSON.stringify(safeUserData));
    },
    '/': (request, response) => {
      response.end(fs.readFileSync('./index.html'));
    },
    '/ClientJWTSessionManager.js': (request, response) => {
      response.end(fs.readFileSync('./node_modules/jwt-session-manager/dist/index.browser.js'));
    },
  };

  function handleRequest(request, response){
    (
      routes[request.url]
      || handleNotFound
    )(request, response);
  }

  const server = http.createServer(handleRequest);

  server.listen(PORT, () => {
    console.log("Server listening on: http://localhost:%s", PORT);
  });
};

main();

// const users = {
//   admin: {
//     password: 'iddqd',
//     name: 'Zaphod Beeblebrox',
//     role: 'god-mode',
//   },
//   test: {
//     password: '1234',
//     name: 'Arthur Dent',
//     role: 'tester',
//   },
// };

// const main = async () => {
//   await db.put('users', users);

//   console.log(
//     await db.get('users', {asBuffer: false})
//   );
// };

// main();
