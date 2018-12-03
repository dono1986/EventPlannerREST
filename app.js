const express = require('express');
const Promise = require('bluebird');
const sqlite = require('sqlite');
 
const app = express();
const port = process.env.PORT || 3000;

app.get('/events', async (req, res, next) => {

  try {
    const db = await dbPromise;

    let date = new Date();
    let day = date.getUTCDate();
    let month = date.getUTCMonth();
    let year = date.getUTCFullYear();
    let timestamp = (day>=10 ? '0' + day : day) + '.' + month + '.' + year;

    const expires = req.params.expires ? req.params.expires : timestamp;
    
    let query = 'SELECT * FROM Events WHERE expires >= \' ${expires} \';';

    let myPromise = async () => {
      let valueArray = [];
      db.each(query, (row, err) => {
          valueArray.push({"id": row.id, "title": row.title, "desc": row.desc, "expires": row.expires})
      })
      return valueArray;
    }

    const [data] = await Promise.all(
        myPromise 
      );

      let returnV = JSON.stringify(data);

      res.json(returnV);

    } catch(err) {
      console.log(err);
      next(err);
    }   
  });

app.get('/event/:id', async (req, res, next) => {

  try {

    const db = await dbPromise;

    console.log("Request for " + req.params.id);

    const id = req.params.id;

    if(id<=0) {
      // Error. falsche ID
    }

    const [data] =  await Promise.all( 
       db.all(`SELECT * FROM Events WHERE id = ${id} ;`)
    );

    let returnV = {};
    if(data) {
      returnV = {"id": data.id, "title": data.title, "desc": data.desc, "expires": data.expires};
    } 

    res.json(returnV);

  } catch(err) {
    console.log(err);
    next(err);
  }   

});

app.delete('/event/:id', async (req, res, next) => {
    try {     
      
      const db = await dbPromise;

      console.log("Request for " + req.params.id);

      const id = req.params.id;

      if(id<=0) {
        // Error. falsche ID
      }
      const [data] = await Promise.all ( 
        db.run(`DELETE FROM Events where id = ${id}`)
      );
      
      res.json({});
    } catch (err) {
      next(err);
    }
  });

app.post('/event/new', (req, res) => {

     res.json({});

  });

const dbPromise = Promise.resolve()
  // First, try to open the database
  .then(() => sqlite.open('./database.sqlite', { Promise }))      // <=
  .then(()=> console.log(`Server is listening on port ${port}`))
  // Update db schema to the latest version using SQL-based migrations
  .then(() => sqlite.migrate({ force: 'last' }))                  // <=
   // Display error message if something went wrong
  .catch((err) => console.error(err.stack))
    // Finally, launch the Node.js app
  .finally(() => app.listen(port))

