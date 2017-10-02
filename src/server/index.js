const bodyParser = require('body-parser');
const express = require('express');
const logger = require('./utils/logger.js');
const mongoose = require('mongoose');
const morgan = require('morgan');
const OAuthServer = require('express-oauth-server');
const authModel = require('./auth/model');

const mongoUrl = 'mongodb://localhost/snail';

mongoose.connect(mongoUrl, err => {
  if (err) {
    logger.error(`ERROR connecting to: ${mongoUrl}: ${err}`);
  }

  logger.info(`Succeeded connecting to: ${mongoUrl}`);
});

const app = express();

app.oauth = new OAuthServer({
  model: authModel,
  grants: ['password'],
  debug: true
});

// Load sample user data
const OAuthUsersModel = mongoose.model('OAuthUsers');
const user = {
  email: 'test@user.com',
  firstname: 'Test',
  lastname: 'User',
  password: 'Password123',
  username: 'test'
};
OAuthUsersModel.findOne(user)
  .then(existingUser => {
    if (!existingUser) {
      const newUser = new OAuthUsersModel(user);

      return newUser.save();
    }
  })
  .then(newUser => {
    if (newUser) {
      logger.debug(`Saved sample data ${JSON.stringify(newUser, null, 2)}`);
    }
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./routes')(app));

app.use(morgan('common', { stream: logger.stream }));

// serve client code
app.use(express.static('./src/client/'));
app.use(express.static('./'));
// Any deep link calls should return index.html
app.use('/*', express.static('./src/client/index.html'));

app.start = () => {
  const server = app.listen(3000, () => {
    const baseUrl = `http://${server.address().host}:${server.address().port}`;

    app.set('url', baseUrl);
    app.emit('started', baseUrl);
    logger.info(`Express server listening on port ${server.address().port}`);
    logger.info(
      `env = ${app.get('env')}` +
        `\n__dirname =  __dirname` +
        `\nprocess.cwd = ${process.cwd()}`
    );
  });

  return server;
};

app.start();
