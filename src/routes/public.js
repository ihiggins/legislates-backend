const express = require('express');
const { search } = require('../data/querrys');
const { getPresident, getSenate, getHouse } = require('../service/core');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('api active');
});

router.get('/president', async function (req, res) {
  const temp = await getPresident();
  res.json(temp);
});

router.get('/senate', async function (req, res) {
  const temp = await getSenate();
  res.json(temp);
});

router.get('/house', async function (req, res) {
  const temp = await getHouse();
  res.json(temp);
});


router.get('/search/:query', async function (req, res) {

  let query= req.params.query;
  const temp = await search(query);
  res.json(temp);
});




module.exports = router;




