'use strict';

const router = require('express').Router();
const Snail = require('./snail.js');

module.exports = router;

router.post('/snail', (req, res) => {
  const snail = new Snail();
  const result = snail.logSnailResult(req);

  res.json(result);
});
