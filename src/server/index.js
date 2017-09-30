const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongoUrl = 'mongodb://localhost/snail';

mongoose.connect(mongoUrl, err => {
  if (err) {
    console.log(`ERROR connecting to: ${mongoUrl}: ${err}`);
  }

  console.log('Succeeded connecting to: ' + mongoUrl);
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./routes'));

app.start = () => {
  const server = app.listen(3000, () => {
    const baseUrl =
      'http://' + server.address().host + ':' + server.address().port;
    app.set('url', baseUrl);
    app.emit('started', baseUrl);
    console.log('Express server listening on port ' + server.address().port);
    console.log(
      'env = ' +
        app.get('env') +
        '\n__dirname = ' +
        __dirname +
        '\nprocess.cwd = ' +
        process.cwd()
    );
  });

  return server;
};

app.start();
