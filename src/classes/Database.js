const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.folderPath = '';
        this.debug = false;
        this.name = "global";
        this._data = {};
        this.dataLoaded = false;
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
        this.loadData();
        return this;
    }

    get data() {
        if (!this.dataLoaded) {
            this.loadData();
        }
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    loadData() {
        try {
            if (!this.folderPath) {
                throw new Error('No folder path set. Use setFolder() to set the storage folder path.');
            }

            if (!this.name) {
                throw new Error('No name set. Use setName() to set the storage file path.');
            }

            const filePath = path.resolve(this.folderPath, `${this.name}.json`);

            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                this._data = JSON.parse(fileContent);
            } else {
                this._data = {};
            }
            this.dataLoaded = true;

            if (this.debug) {
                console.log('Data loaded successfully:', this._data);
            }
        } catch (error) {
            if (this.debug) {
                console.error('[@Database] Error loading data:', error.message);
            }
            this._data = {};
        }
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

            fs.writeFileSync(filePath, JSON.stringify(this._data, null, 2), 'utf8');
            if (this.debug) {
                console.log('Data saved successfully:', this._data);
            }
        } catch (error) {
            if (this.debug) {
                console.error('[@Database] Error saving data:', error.message);
            }
        }
    }

    find(filterFunction) {
        if (!this.dataLoaded) {
            this.loadData();
        }
    
        const matches = [];
    
        for (const key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                const element = this._data[key];
                if (Array.isArray(element)) {
                    for (const subElement of element) {
                        if (filterFunction(subElement)) {
                            matches.push(subElement);
                        }
                    }
                } else {
                    if (filterFunction(element)) {
                        matches.push(element);
                    }
                }
            }
        }
    
        return matches;
    }
    
    

}

module.exports = Database;
