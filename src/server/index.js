const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('./utils/logger.js');
const morgan = require('morgan');
const mongoUrl = 'mongodb://localhost/snail';

mongoose.connect(mongoUrl, err => {
  if (err) {
    logger.error(`ERROR connecting to: ${mongoUrl}: ${err}`);
  }

  logger.info(`Succeeded connecting to: ${mongoUrl}`);
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./routes'));
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
