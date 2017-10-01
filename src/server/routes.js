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
