# user-space
A generic user system made to plug into any node/express/mongo backend.

## Installation
```bash
npm install --save LincolnColeHoward/user-space
```

## Application Implications

user-space occupies these routes:
* POST /users
* DELETE /users
* POST /sessions
* DELETE /sessions

user-space sets up a local authentication system

## Usage

in index.js/server.js/main.js
```javascript
  // get the module
  let userSpace = require ('user-space').init;
  
  // uses your express 'app' instance
  // uses your mongoose instance
  // uses your passport instance
  // must provide a secret for cookies
  // must provide mongo uri for session store
  userSpace (app, mongoose, passport, secret, uri);
```

retrieving the User model
```javascript
  let User = require ('user-space').User;
```

in a lib.js for browserify
```javascript
  global.User = require ('./node_modules/user-space/api/user-space');
```