const Database = require('./classes/Database');
const { log } = require('./utils/logger');

global.log = log;

module.exports = { Database };
