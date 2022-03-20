const { Client } = require('pg')

const dbClient = new Client();
dbClient.connect();

module.exports =  dbClient 