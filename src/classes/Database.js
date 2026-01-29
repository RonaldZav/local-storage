const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Collection {
    constructor(dbPath, name) {
        this.collectionPath = path.join(dbPath, name);
        if (!fs.existsSync(this.collectionPath)) {
            fs.mkdirSync(this.collectionPath, { recursive: true });
        }
    }

    _getFilePath(id) {
        // Sanitizar ID para evitar problemas con nombres de archivo
        const safeId = String(id).replace(/[^a-zA-Z0-9-_]/g, '_');
        return path.join(this.collectionPath, `${safeId}.json`);
    }

    _readAll() {
        try {
            const files = fs.readdirSync(this.collectionPath).filter(f => f.endsWith('.json'));
            return files.map(file => {
                try {
                    const content = fs.readFileSync(path.join(this.collectionPath, file), 'utf8');
                    return JSON.parse(content);
                } catch (e) { return null; }
            }).filter(d => d);
        } catch (e) {
            return [];
        }
    }

    _matches(doc, query) {
        for (const key in query) {
            if (doc[key] !== query[key]) return false;
        }
        return true;
    }

    async findOne(query) {
        // Optimización: si la query es solo por _id, vamos directo al archivo
        if (Object.keys(query).length === 1 && query._id) {
            const filePath = this._getFilePath(query._id);
            if (fs.existsSync(filePath)) {
                try {
                    const doc = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    return this._enhanceDoc(doc);
                } catch (e) { return null; }
            }
            return null;
        }

        const docs = this._readAll();
        const doc = docs.find(d => this._matches(d, query));
        return doc ? this._enhanceDoc(doc) : null;
    }

    async find(query = {}) {
        const docs = this._readAll();
        const filtered = docs.filter(d => this._matches(d, query));
        return {
            toArray: async () => filtered.map(d => this._enhanceDoc(d))
        };
    }

    async insertOne(doc) {
        if (!doc._id) doc._id = crypto.randomUUID();
        const filePath = this._getFilePath(doc._id);
        
        // Guardar archivo
        fs.writeFileSync(filePath, JSON.stringify(doc, null, 2));
        
        return { acknowledged: true, insertedId: doc._id };
    }

    async updateOne(query, update) {
        const doc = await this.findOne(query);
        if (doc) {
            if (update.$set) {
                Object.assign(doc, update.$set);
            } else {
                Object.assign(doc, update);
            }
            
            // Guardar cambios
            const filePath = this._getFilePath(doc._id);
            const { save, ...dataToSave } = doc;
            fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
            
            return { acknowledged: true, modifiedCount: 1 };
        }
        return { acknowledged: true, modifiedCount: 0 };
    }

    async deleteOne(query) {
        const doc = await this.findOne(query);
        if (doc && doc._id) {
            const filePath = this._getFilePath(doc._id);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return { acknowledged: true, deletedCount: 1 };
            }
        }
        return { acknowledged: true, deletedCount: 0 };
    }

    _enhanceDoc(doc) {
        // Definir save() como propiedad no enumerable para que no se guarde en el JSON
        Object.defineProperty(doc, 'save', {
            value: async () => {
                const filePath = this._getFilePath(doc._id);
                const { save, ...dataToSave } = doc;
                fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
                return doc;
            },
            configurable: true,
            writable: true,
            enumerable: false
        });
        return doc;
    }
}

class Db {
    constructor(basePath) {
        this.basePath = basePath;
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }

    collection(name) {
        return new Collection(this.basePath, name);
    }
}

class Database {
    constructor(uri) {
        this.uri = uri;
        this.dbName = 'default';
        
        if (uri && uri.startsWith('localstorage://')) {
            this.dbName = uri.split('localstorage://')[1];
        }
        
        // Ruta base: ./localstorage/<dbName>
        this.dbPath = path.join(process.cwd(), 'localstorage', this.dbName);
    }

    async connect() {
        if (!fs.existsSync(this.dbPath)) {
            fs.mkdirSync(this.dbPath, { recursive: true });
        }
    }

    db(name) {
        // Si se pasa un nombre, se usa ese subdirectorio, si no, se usa el de la URI
        // Nota: En mongo client.db('otro') cambia de DB. Aquí haremos lo mismo.
        if (name) {
            const newPath = path.join(process.cwd(), 'localstorage', name);
            return new Db(newPath);
        }
        return new Db(this.dbPath);
    }
}

module.exports = Database;