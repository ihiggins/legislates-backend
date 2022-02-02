const fetch = require('node-fetch');
const cheerio = require('cheerio');

const NodeCache = require('node-cache');
const queryCache = new NodeCache();

const Parser = require('rss-parser');
const parser = new Parser();
const logger = require('../config/logger');
let president = [];
let house = [];
let senate = [];

const parseRss = async (link) => {
  const res = await parser.parseURL(link);
  return res.items;
};
const scrapeArticles = async (html) => {
  const $ = cheerio.load(html);
  let results = [];
  let res = $('#main')
    .find('.xpd')
    .each(function (_index, element) {
      if (element.children.length !== 3) return;

      const temp = {
        time: $(element).find('span').first().text(),
        pub: $(element).find('a > div').text(),
        title: $(element).find('h3').text(),
        url: $(element).find('a').attr('href').substring(7),
      };
      if (Object.values(temp).includes('')) return;
      results.push(temp);
    });
  return results;
};
const queryNews = async (query) => {
  try {
    const inCache = queryCache.get(query);
    if (inCache) return inCache;
    logger.warn('no cache');
    const response = await fetch(`https://www.google.com/search?q=${query}&tbm=nws&`);
    const body = await response.text();
    const scraped = await scrapeArticles(body);
    queryCache.set(query, scraped);
    return scraped;
  } catch (e) {
    return false;
  }
};
const init = async () => {
  president = await parseRss('https://www.congress.gov/rss/presented-to-president.xml');
  house = await parseRss('https://www.congress.gov/rss/house-floor-today.xml');
  senate = await parseRss('https://www.congress.gov/rss/senate-floor-today.xml');

  logger.info('Rss fetched');
};
const getPresident = async () => {
  // eslint-disable-next-line prefer-const
  let proxy = president;
  await Promise.all(
    proxy.map(async (item) => {
      // eslint-disable-next-line no-param-reassign
      item.news = await queryNews(item.content);
    })
  );
  return proxy;
};
const getSenate = async () => {
  // eslint-disable-next-line prefer-const
  let proxy = senate;
  await Promise.all(
    proxy.map(async (item) => {
      // eslint-disable-next-line no-param-reassign
      item.news = await queryNews(item.content);
    })
  );
  return proxy;
};
const getHouse = async () => {
  // eslint-disable-next-line prefer-const
  let proxy = house;
  await Promise.all(
    proxy.map(async (item) => {
      // eslint-disable-next-line no-param-reassign
      item.news = await queryNews(item.content);
    })
  );
  return proxy;
};

module.exports = {
  queryNews,
  scrapeArticles,
  getPresident,
  getSenate,
  getHouse,
  init,
};
