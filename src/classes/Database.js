const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.folderPath = '';
        this.debug = false;
        this.name = "global";
        this.data = {};
    }

    setFolder(folderPath) {
        this.folderPath = folderPath;
        return this;
    }

    setDebug(debug) {
        this.debug = debug;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    save() {
        try {
            if (!this.folderPath) {
                throw new Error('No folder path set. Use setFolder() to set the storage folder path.');
            }

            if (!this.name) {
                throw new Error('No name set. Use setName() to set the storage file path.');
            }

            const filePath = path.resolve(this.folderPath, `${this.name}.json`);

            if (!fs.existsSync(this.folderPath)) {
                fs.mkdirSync(this.folderPath, { recursive: true });
            }

            fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2), 'utf8');
            if(this.debug) { log('Data saved successfully:', "log");
                console.log(this.data);
            }
        } catch (error) {
            if(this.debug) log('[@Database] Error:', "error");
            console.log(error.message);
        }
    }
}

module.exports = Database;
