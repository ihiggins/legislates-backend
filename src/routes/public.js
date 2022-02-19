const express = require('express');
const { getPresident, getSenate, getHouse } = require('../service/core');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('Birds home page');
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






module.exports = router;



  route / controller / service 


