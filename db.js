const mongoClient = require('mongodb').MongoClient;
  const mongoDbUrl = 'mongodb://127.0.0.1:27017';
  let _db;

  function connect(callback){
    mongoClient.connect(mongoDbUrl, (err, client) => {
      _db = client.db('Patients');
      callback(err);
    });
  }

  function get(){
    return _db;
  }

  function close(){
    _db.close();
  }

  module.exports = {
    connect,
    get,
    close
  };