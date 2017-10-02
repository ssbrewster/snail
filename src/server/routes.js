'use strict';

const router = require('express').Router();
const asyncMiddleware = require('./async.middleware');
const Snail = require('./snail');

module.exports = router;

router.post(
  '/snail',
  asyncMiddleware(async (req, res) => {
    const snail = new Snail();
    const result = await snail.logSnailResult(req);

    res.json(result);
  })
);

router.get(
  '/snail/results',
  asyncMiddleware(async (req, res) => {
    const snail = new Snail();
    const pastResults = await snail.getPastResults();

    res.json(pastResults);
  })
);

router.get(
  '/snail/report',
  asyncMiddleware(async (req, res) => {
    const snail = new Snail();
    const report = await snail.generateReport();

    res.json(report);
  })
);
