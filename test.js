const { Database } = require('./src/main');

let myFirstDB = new Database()
.setFolder('./storage')
.setName('guild-123')
.setDebug(true);

myFirstDB.data = { customdata: 'test' };

myFirstDB.save();