var FS = require('fs');
var CSV = require('fast-csv');

var FileStore = require('../models/fileStore');

var CacheController = {
  FOLDERNAME: '__etlbotcache',
  build: function(source, destination, config){
    if(!config){
      console.log('> missing config');
      return false;
    } else if(config && (!config.cache || !config.cache.fieldMap || !Array.isArray(config.cache.fieldMap))){
      console.log('> missing cache config');
      return false;
    }

    var parseOpts = {
      headers: true,
      trim: true,
    };
    if(config.parse.maxRows){
      parseOpts.maxRows = config.parse.maxRows;
    }
    if(config.parse.delimiter){
      parseOpts.delimiter = config.parse.delimiter;
    }

    var cache = new FileStore(destination);
    var CSVStream = FS.createReadStream(source).pipe(CSV.parse(parseOpts));

    CSVStream.on('data', function(rowObj){
      config.cache.fieldMap.forEach(function(field){
        if(typeof field.value === 'function'){
          cache.setItem(field.key, field.value(rowObj)); 
        } else if(typeof field.value === 'string' && !field.static){
          cache.setItem(field.key, rowObj[field.value]); 
        } else if(field.static){
          cache.setItem(field.key, field.value); 
        }
      });
    });

    CSVStream.on('error', function(err){
      console.log('> uhoh', err);
    });

    CSVStream.on('end', function(rowCount){
      console.log('> Success! Rows processed:', rowCount);
    });
  }
};

module.exports = CacheController;