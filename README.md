## Server

Implement store and validation functions:

```js
// Optional
const storeJWTSecretHandler = async (jwtSecret) => {
  await db.put('sessionEncryptSecret', jwtSecret);
};

const validateRequestHandler = async ({username, password}) => {
  const userAndPasswordValid = /* Boolean */;

  return userAndPasswordValid;
};

const storeSessionKeyHandler = async (sessionKey, {username}) => {
  const users = await db.get('users');

  users[username].sessionKey = sessionKey;

  return await db.put('users', users).then(() => sessionKey).catch(() => null);
};

const validateSessionKeyInStoreHandler = async (sessionKey, {username}) => {
  const users = await db.get('users');

  return (users[username] || {}).sessionKey === sessionKey;
};
```

Instantiate Server Session Manager:

```js
const sessionManager = new ServerJWTSessionManager({
  jwtSecret: await db.get('sessionSecret', {asBuffer: false}).catch((e) => null),
  storeJWTSecretHandler,
  validateRequestHandler,
  storeSessionKeyHandler,
  validateSessionKeyInStoreHandler,
});

// If you implement storeJWTSecretHandler you can wait for
// the JWT secret to be stored using jwtSecretStorePromise
await sessionManager.jwtSecretStorePromise.then(() => console.log(sessionManager.jwtSecret));
```

Use the Server Session Manager instance to validate:

```js
app.get('/request-token', (request, response) => {
  response.end(sessionManager.generateSessionRequestToken());
});

app.post('/login', (request, response) => {
  const {
    requestToken,
    username,
    password,
  } = request.body;

  const sessionToken = await sessionManager.processSessionRequest(requestToken, {
    username,
    password,
  });

  if (!sessionToken) {
    return handleNotAuthorized(request, response);
  }

  response.end(sessionToken);
});

app.get('/logout', async (request, response) => {
  const sessionToken = request.headers['authorization'].replace(/^Bearer\s/, '');
  const username = request.headers['user'];

  const valid = await sessionManager.checkSessionToken(sessionToken, {username});

  if (!valid) {
    return handleNotAuthorized(request, response);
  }

  const users = await db.get('users');

  const {
    sessionKey,
    ...loggetOutUserData
  } = users[username];

  users[username] = loggetOutUserData;

  await db.put('users', users);

  response.end('ok');
});

app.get('/user', async (request, response) => {
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
});
```

## Client

Implement get functions (required):

```js
// This example is for browser with bluebird and jquery
// for other versions in "examples" directory

var getSessionRequestTokenHandler = function() {
  return new Promise(function(resolve, reject) {
    $.get('request-token', function(data) {
      resolve(data);
    });
  })
};

var getSessionHandler = function(sessionRequestToken) {
  return new Promise(function(resolve, reject) {
    var loginOptions = {
      requestToken: sessionRequestToken,
      username: $('.username')[0].value,
      password: $('.password')[0].value,
    };

    $.post('login', loginOptions, function(data) {
      resolve(data);
    }).fail(function() {
      reject(null);
    });
  });
};
```

*Optionally* implement store and/or close functions:

```js
var storeSessionRequestTokenHandler = function(sessionRequestToken) {
  return new Promise(function(resolve, reject) {
    try {
      window.localStorage.setItem('requestToken', sessionRequestToken);

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

var storeSessionTokenHandler = function(sessionToken) {
  return new Promise(function(resolve, reject) {
    try {
      window.localStorage.setItem('sessionToken', sessionToken);
      window.localStorage.setItem('username', $('.username')[0].value);
      window.localStorage.removeItem('requestToken');

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

var closeSessionHandler = function(sessionToken) {
  return new Promise(function(resolve, reject) {
    try {
      window.localStorage.removeItem('sessionToken');

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
```

Instantiate Client Session Manager:

```js
var sessionManager = new ClientJWTSessionManager({
  getSessionRequestTokenHandler,
  storeSessionRequestTokenHandler,
  getSessionHandler,
  storeSessionTokenHandler,
  closeSessionHandler,
}, {
  // Optional to keep session alive, in this example only works if you implemented
  // storeSessionRequestTokenHandler and storeSessionTokenHandler
  sessionRequestToken: window.localStorage.getItem('requestToken'),
  sessionToken: window.localStorage.getItem('sessionToken'),
});
```

Use the Client Session Manager instance to request data safely:

```js
var initializeLoginForm = function() {
  $('.login-button').click(function(e) {
    e.preventDefault();

    sessionManager.getSession().then(function() {
      // You are logged in, you can redirect or do something here
    }).catch(function() {
      sessionManager.getSessionRequestToken().then(function() {
        alert('You took too long to log in, reload the page and try again.');
      }).catch(function() {
        alert('Unable to get request token from server.');
      })
    });
  });
};

sessionManager.getSessionRequestToken().then(initializeLoginForm);
```

## Tests

Tests implemented using jest

```
yarn test
```

## Lint

Linting uses tslint

```
yarn lint
```

## Build

Build uses rollup to build Node module and Browser compatible dist files

```
yarn build
```

**note:** if you change version be sure to run tests before build so version file gets updated

## More examples

In the `examples` directory

## TODO

Better documentation

## Contribute

Contributions welcome and encouraged

## License

Apache 2.0
