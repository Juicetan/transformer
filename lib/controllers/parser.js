var FS = require('fs');

var CSV = require('fast-csv');
var StringUtil = require('../utils/string');

var ParseController = {
  parse: function(source, destination){
    console.log(source, ' ', destination);

    var FileWriteStream = FS.createWriteStream(destination);
    var CSVWriteStream = CSV.format({
      headers: true
    });
    CSVWriteStream.pipe(FileWriteStream);

    var CSVStream = FS.createReadStream(source).pipe(CSV.parse({
      headers: true,
      trim: true,
      maxRows: 1
    }));
    
    CSVStream.on('data', function(rowObj){
      console.log('> row', rowObj);
      CSVWriteStream.write({
        name: rowObj.merchant_name,
        address: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        latitude: rowObj.latitude,
        longitude: rowObj.longitude,
        length: 100,
        label: 'starbucks;cofeeshop;'+StringUtil.replaceAllStr(rowObj.address_cleansed,' ','_')
      });
    });

    CSVStream.on('error', function(err){
      console.log('> uhoh', err);
    });

    CSVStream.on('end', function(rowCount){
      console.log('> done', rowCount);
      CSVWriteStream.end();
    });
  },

};

module.exports = ParseController;