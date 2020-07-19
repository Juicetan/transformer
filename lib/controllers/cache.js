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

    var count = 0;
    CSVStream.on('data', function(rowObj){
      count++;
      if(count % 1000 === 0){
        console.log('> processed', count);
      }

      config.cache.fieldMap.forEach(function(field){
        var cacheKey = rowObj[field.key];
        if(typeof field.key === 'function'){
          cacheKey = field.key(rowObj, cache);
        } else if(typeof field.key === 'string' && field.staticKey){
          cacheKey = field.key
        }

        if(typeof field.value === 'function'){
          cache.setItem(cacheKey, field.value(rowObj, cache)); 
        } else if(typeof field.value === 'string' && !field.static){
          cache.setItem(cacheKey, rowObj[field.value]); 
        } else if(field.static){
          cache.setItem(cacheKey, field.value); 
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