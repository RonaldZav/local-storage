# @ronaldzav/local-storage
📁 Local storage system for your discord bot

## Installation

```bash
npm install @ronaldzav/local-storage
```
If you are using yarn:

```bash
yarn add @ronaldzav/local-storage
```

You can use the latest version of `local-storage` setting this in your package.json:

```bash
    "dependencies": {
      "@ronaldzav/local-storage": "github:ronaldzav/local-storage"
    }
```

## Usage

```js
const { Database } = require('@ronaldzav/local-storage');

let myFirstDB = new Database()
.setFolder('./storage')
.setName('guild-123')
.setDebug(true);

myFirstDB.data = { 
  "1": { "name": "Mario", "age": 10 }, 
  "2": { "name": "Maria", "age": 10 }, 
  "3": { "name": "Luigi", "age": 10 } 
  };

myFirstDB.save(); // Save the database

console.log(myFirstDB.find(element => element.name == "Mario")); // Output: [ { name: 'Mario', age: 10 } ]
```

## API

### `new Database()`

#### setFolder(folder)

Set the folder where the database will be saved.

#### setName(name)

Set the name of the database.

#### setDebug(debug)

Set the debug mode.

## METHODS

#### save()

Save the database.

#### find(filterFunction)

Find an element in the database.


