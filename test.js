const { Database } = require('./src/main');

let myFirstDB = new Database()
.setFolder('./storage')
.setName('guild-123')
.setDebug(false);

console.log(myFirstDB.data);
myFirstDB.data = { asd: 123 };

myFirstDB.save();