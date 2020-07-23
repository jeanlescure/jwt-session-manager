const fs = require('fs');
const http = require('http');
const {stringify} = require('querystring');
const {ClientJWTSessionManager} = require('jwt-session-manager');

const PORT = 8080;

const handleResponse = (response, resolve, reject) => {
  let str = '';

  response.on('data', (data) => {
    str += data.toString();
  });

  response.on('end', () => {
    resolve(str);
  });

  response.on('error', (err) => {
    reject(err);
  });
};

const handleNotFound = (request, response) => {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end('NOT FOUND');
};

const sessionManager = new ClientJWTSessionManager({
  getSessionRequestTokenHandler: () => {
    return new Promise((resolve, reject) => {
      http.get(
        'http://localhost:8081/request-token',
        (response) => handleResponse(response, resolve, reject),
      ).end();
    });
  },
  getSessionHandler: (requestToken) => {
    return new Promise((resolve, reject) => {
      const req = http.request(
        'http://localhost:8081/execution-token',
        {
          method: 'POST',
        },
        (response) => handleResponse(response, resolve, reject),
      );

      req.write(stringify({
        requestToken,
        key: fs.readFileSync('.key').toString(),
      }));

      req.end();
    });
  },
});

const routes = {
  '/': async (request, response) => {
    await sessionManager.getSessionRequestToken();

    await sessionManager.getSession();

    const sensitiveData = await new Promise((resolve, reject) => {
      http.get(
        'http://localhost:8081/sensitive-data',
        {
          headers: {
            'Authorization': `Bearer ${sessionManager.sessionToken}`,
            'Key': fs.readFileSync('.key').toString(),
          },
        },
        (res) => handleResponse(res, resolve, reject),
      ).end();
    });

    console.log(sensitiveData);
    response.end(sensitiveData);
  }
};

const handleRequest = (request, response) => {
  (
    routes[request.url]
    || handleNotFound
  )(request, response);
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log("Server listening on: http://localhost:%s", PORT);
});
