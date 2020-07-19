var FS = require('fs');
var CSV = require('fast-csv');

var FilterController = {
  parse: function(source, destination, config, cache){
    if(!config){
      console.log('> missing config');
      return false;
    } else if(config && (!config.filter || typeof config.filter !== 'function')){
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
    var filteredCount = 0;
    CSVStream.on('data', function(rowObj){
      if(config.filter(rowObj, cache)){
        CSVWriteStream.write(rowObj);
        filteredCount++;
      }

      count++;
      if(count % 1000 === 0){
        console.log('> processed', count);
      }
    });

    CSVStream.on('error', function(err){
      console.log('> uhoh', err);
    });

    CSVStream.on('end', function(rowCount){
      console.log('> Success! Rows processed:', rowCount);
      console.log('> resultant filtered row count:', filteredCount);
    });
  }
};

module.exports = FilterController;