const express = require('express');
const { getPresident } = require('../service/core');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('Birds home page');
});

router.get('/president', async function (req, res) {
  const temp = await getPresident();
  res.json(temp);
});

module.exports = router;
