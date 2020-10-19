var FS = require('fs');
var CSV = require('fast-csv');

var Validation = require('../models/validation');
var FileStore = require('../models/fileStore');

var CacheController = {
  FOLDERNAME: '__etlbotcache',
  build: function(source, destination, config){
    if(!config){
      throw new Validation().addError('Missing config','',{
        code: Validation.type.MISSINGARG,
        context: 'config'
      });
    } else if(config && (!config.cache || !config.cache.fieldMap || !Array.isArray(config.cache.fieldMap))){
      throw new Validation().addError('Missing config','No cache specification in config',{
        code: Validation.type.MISSINGARG,
        context: 'cache'
      });
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
      config.cache.fieldMap.forEach(function(field){
        if(!rowObj.hasOwnProperty(field.key)){
          throw new Validation().addError('Invalid configuration', 'key name not found',{
            code: Validation.type.INVALIDARG,
            context: field.key
          });
        }
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

      count++;
      if(count % 1000 === 0){
        console.log('> processed', count);
      }
    });

    CSVStream.on('error', function(err){
      console.log('Error', err);
    });

    CSVStream.on('end', function(rowCount){
      console.log('> Success! Rows processed:', rowCount);
    });
  }
};

module.exports = CacheController;