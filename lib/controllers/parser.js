var FS = require('fs');
var CSV = require('fast-csv');

var ParseController = {
  parse: function(source, destination, config){
    if(!config){
      console.log('> missing config');
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

    var writeOpts = {
      headers: true
    };
    if(config.transform.delimiter){
      writeOpts.delimiter = config.transform.delimiter;
    }

    var FileWriteStream = FS.createWriteStream(destination);
    var CSVWriteStream = CSV.format(writeOpts);
    CSVWriteStream.pipe(FileWriteStream);

    var CSVStream = FS.createReadStream(source).pipe(CSV.parse(parseOpts));
    
    var count = 0;
    CSVStream.on('data', function(rowObj){
      var writeObj = {};
      config.transform.fieldMap.forEach(function(field){
        if(typeof field.value === 'function'){
          writeObj[field.key] = field.value(rowObj); 
        } else if(typeof field.value === 'string' && !field.static){
          writeObj[field.key] = rowObj[field.value];
        } else if(field.static){
          writeObj[field.key] = field.value;
        }
      });
      CSVWriteStream.write(writeObj);

      count++;
      if(count % 1000 === 0){
        console.log('> processed', count);
      }
    });

    CSVStream.on('error', function(err){
      console.log('> uhoh', err);
    });

    CSVStream.on('end', function(rowCount){
      console.log('> Success! Rows transformed:', rowCount);
      CSVWriteStream.end();
    });
  },

};

module.exports = ParseController;