/* Load modules */
let sqlite3 = require('sqlite3').verbose();

/*
 * Database configuration
 */

/* Load database file (Creates file if not exists) */
let db = new sqlite3.Database('./events.db');

/* Init tables if they don't exist */
let init = async function (cleanDB) {

    if(cleanDB) {
        const cleanDBPromise = new Promise( (resolve, reject) =>
        {
            db.run("DROP TABLE IF EXISTS Event;", function (err)  {
                if(err) reject(err);
                else resolve();
            });
        });

        console.log("Cleaning database");
        try {
            await cleanDBPromise;
        } catch(err) {
            console.log(`Error cleaning db because: ${err}`);
        }
    }

    const createEventTablePromise = new Promise( (resolve, reject) =>
        {
            db.run("CREATE TABLE IF NOT EXISTS Event (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            " title TEXT," +
            " desc TEXT," +
            " expires TEXT" +
            ");", function (err) {
                if(err) reject(err);
                else resolve();
            });
        });

    //console.log("Creating table");
    try {
        await createEventTablePromise;
    } catch(err) {
        console.log(`Error creating table because: ${err}`);
    }
    
    const createTitleIndexPromise = new Promise( (resolve, reject) =>
    {
        db.run("CREATE INDEX IF NOT EXISTS Events_ix_title ON Event (id, title);", function (err) {
            if(err) reject(err);
            else resolve();
        });
    });

    const createExpiresIndexPromise = new Promise( (resolve, reject) =>
    {
        db.run("CREATE INDEX IF NOT EXISTS Events_ix_expires ON Event (expires);", function (err) {
            if(err) reject(err);
            else resolve();
        });
    });

    //console.log("Creating index");
    try {
        await Promise.all([createTitleIndexPromise, createExpiresIndexPromise]);
    } catch(err) {
        console.log(`Error creating index because: ${err}`);
    }

    //console.log("Inserting test data");
    //db.run("INSERT INTO Event (title, desc, expires) VALUES ('Test','PARTY!', '2014-12-31');");
};

module.exports = {
    init: init,
    db: db
};

