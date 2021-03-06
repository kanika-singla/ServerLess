"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = ''; // or Atlas connection string

let cachedDb = null;

exports.handler = function(event, context, callback) {
  // console.log("Incoming Event: ", event);
   const bucket = event.Records[0].s3.bucket.name;
   const filename = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
   const message = `File is uploaded in - ${bucket} -> ${filename}`;
   console.log(message);
   const url = `https://${bucket}.s3.amazonaws.com/${filename}`;
  console.log(url)
  queryDatabase(filename, url, bucket);
  callback(null, message);
};

function queryDatabase (filename, url, db_name) {
  MongoClient.connect(MONGODB_URI, function (err, client) {
                var img_cat = filename.split("-")[1];
                var db = client.db(db_name);
                  db.collection('images').update({name: filename}, {name: filename, poster: url, category: img_cat}, {upsert: true})
                  .then(() => { return { statusCode: 200, body: 'success' }; })
                  .catch(err => {
                    console.log('=> an error occurred: ', err);
                    return { statusCode: 500, body: 'error' };
                  });
  });
}
