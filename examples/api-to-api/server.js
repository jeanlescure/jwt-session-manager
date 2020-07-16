const fs = require('fs');
const http = require('http');
const {parse} = require('querystring');
const {ServerJWTSessionManager} = require('jwt-session-manager');

let sessionKeys = [];

const sessionExpired = (keyObj) => {
  const {iat} = keyObj;

  return (iat + 30) - Math.floor(Date.now() / 1000) < 0;
};

const storeSecretHandler = async (secret) => {
  try {
    fs.statSync('.secret');
  } catch(e) {
    fs.writeFileSync('.secret', secret);
  }
};

const validateRequestHandler = async ({key}) => {
  return key === fs.readFileSync('.key').toString();
};

const storeSessionKeyHandler = async (sessionKey) => {
  sessionKeys.push({iat: Math.floor(Date.now() / 1000), sessionKey});

  sessionKeys = sessionKeys.filter((keyObj) => !sessionExpired(keyObj));

  console.log(sessionKeys);

  return sessionKey;
};

const validateSessionKeyInStoreHandler = async (sessionKey) => {
  sessionKeys = sessionKeys.filter((keyObj) => !sessionExpired(keyObj));

  const valid = typeof sessionKeys.find((keyObj) => sessionKey === keyObj.sessionKey) !== 'undefined';

  sessionKeys = valid ? sessionKeys.filter((keyObj) => keyObj.sessionKey !== sessionKey) : sessionKeys;

  console.log(sessionKeys);

  return valid;
};

const main = async () => {
  const sessionManager = new ServerJWTSessionManager({
    secret: await new Promise((resolve) => resolve(fs.readFileSync('.secret'))).catch(() => null),
    storeSecretHandler,
    validateRequestHandler,
    storeSessionKeyHandler,
    validateSessionKeyInStoreHandler,
  });

  // await sessionManager.secretStorePromise.then(() => console.log(sessionManager.secret));

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
    '/execution-token': (request, response) => {
      if (request.method === 'POST') {
        let body = '';

        request.on('data', chunk => {
          body += chunk.toString();
        });

        request.on('end', async () => {
          const {
            requestToken,
            key,
          } = parse(body);

          console.log(requestToken, key);

          const result = await sessionManager.processSessionRequest(
            requestToken,
            {
              key,
            },
          );

          if (!result) {
            return handleNotAuthorized(request, response);
          }

          response.end(result);
        });
      } else {
        handleNotFound(request, response);
      }
    },
    '/sensitive-data': async (request, response) => {
      const sessionToken = request.headers['authorization'].replace(/^Bearer\s/, '');
      const key = request.headers['key'];

      const valid = await sessionManager.checkSessionToken(sessionToken, {key});

      if (!valid) {
        return handleNotAuthorized(request, response);
      }

      response.end(JSON.stringify({
        data: 'Some really sensitive data ;)',
      }));
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
