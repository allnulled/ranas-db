import Dexie from "dexie";
import DexieRelationships from "dexie-relationships";
import Check from "@allnulled/check-that";

const defaultOptions = {
    debug: false
};


console.log("[*] Cargando RanasDB...");

class RanasDB {

    static get Dexie() {
        return Dexie;
    }

    static get DexieRelationships() {
        return DexieRelationships;
    }

    static get Check() {
        return Check;
    }

    static create(id, versionation, options, schema) {
        return new RanasDB(id, versionation, options, schema);
    }

    static connect(id, versionation, options, schema) {
        const db = new RanasDB(id, versionation, options, schema);
        return db.initialize();
    }

    static dropDatabase(id) {
        return RanasDB.Dexie.delete(id);
    };

    static dropDatabaseIfExists(id) {
        try {
            return RanasDB.Dexie.delete(id);
        } catch (error) {}
    };

    static get defaultOptions() {
        return defaultOptions;
    }

    constructor(id = "Base_de_datos_por_defecto_de_ranas_db", versionation = [], options = this.constructor.defaultOptions, schema = {}) {
        Check.that(id).isString();
        Check.that(versionation).isArray();
        for(let index = 0; index < versionation.length; index++) {
            const version = versionation[index];
            Check.that(version).isArray().hasLengthGreaterThan(1);
            Check.that(version[0]).isObject();
            Check.that(version[1]).isFunction();
        }
        this.options = options;
        this.databaseID = id;
        this.versionation = versionation;
        this.dexieDB = new Dexie(this.databaseID, {
            addons: [DexieRelationships]
        });
    }

    debug(...args) {
        if(typeof this.options.debug === "function") {
            this.options.debug(...args);
        }
    }

    initialize() {
        this.debug(`Initializing: #${this.databaseID}`);
        if(!this.dexieDB.isOpen()) {
            for(let index = 0; index < this.versionation.length; index++) {
                const [store, upgrade] = this.versionation[index];
                const storeVersion = this.dexieDB.version(index + 1).stores(store);
                if(upgrade) {
                    storeVersion.upgrade(upgrade);
                }
            }
        }
        return this;
    }

    select(table, filter = () => true, joins = []) {
        this.debug(`Selecting on: #${this.databaseID} » ${table}`, {table, filter, joins});
        Check.that(table).isString();
        Check.that(filter).isFunction();
        let collection = this.dexieDB.table(table).filter(filter);
        for(let index = 0; index < joins.length; index++) {
            let join = joins[index];
            collection = collection.with({ [join]: join })
        }
        return collection.toArray();
    }

    insert(table, item) {
        this.debug(`Inserting on: #${this.databaseID} » ${table}`, {table, item});
        Check.that(table).isString();
        Check.that(item).isObject();
        return this.dexieDB.table(table).add(item);
    }

    update(table, id, value) {
        this.debug(`Updating on: #${this.databaseID} » ${table}`, {table, id, value});
        Check.that(table).isString();
        Check.that(id).isNumber();
        Check.that(value).isObject();
        return this.dexieDB.table(table).update(id, value);
    }

    delete(table, id) {
        this.debug(`Deleting on: #${this.databaseID} » ${table}`, {table, id});
        Check.that(table).isString();
        Check.that(id).isNumber();
        return this.dexieDB.table(table).delete(id);
    }

}

if(typeof window !== "undefined") {
    window.RanasDB = RanasDB;
}

if(typeof global !== "undefined") {
    global.RanasDB = RanasDB;
}

export default RanasDB;