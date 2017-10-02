'use strict';

const router = require('express').Router();
const asyncMiddleware = require('./async.middleware');
const Snail = require('./snail');

module.exports = app => {
  router.post('/login', app.oauth.token());

  router.post(
    '/snail',
    app.oauth.authenticate(),
    asyncMiddleware(async (req, res) => {
      const snail = new Snail();
      const result = await snail.logSnailResult(req);

      res.json(result);
    })
  );

  router.get(
    '/snail/results',
    app.oauth.authenticate(),
    asyncMiddleware(async (req, res) => {
      const snail = new Snail();
      const pastResults = await snail.getPastResults();

      res.json(pastResults);
    })
  );

  router.get(
    '/snail/report',
    app.oauth.authenticate(),
    asyncMiddleware(async (req, res) => {
      const snail = new Snail();
      const report = await snail.generateReport();

      res.json(report);
    })
  );

  return router;
};
