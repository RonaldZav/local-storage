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
const { Database } = require('./src/main');

let myFirstDB = new Database()
.setFolder('./storage')
.setName('guild-123')
.setDebug(true);

myFirstDB.data = { customdata: 'test' };

myFirstDB.save();
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