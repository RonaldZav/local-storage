const { Database } = require('./src/main');

let myFirstDB = new Database()
.setFolder('./storage')
.setName('guild-123')
.setDebug(false);

//console.log(myFirstDB.data);
//myFirstDB.data = { "1": { "name": "Mario", "age": 10 }, "2": { "name": "Maria", "age": 10 }, "3": { "name": "Luigi", "age": 10 } };

//myFirstDB.save();

console.log(myFirstDB.find(element => element.name == "Mario"));