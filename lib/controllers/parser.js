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
      // maxRows: 1
    }));
    
    CSVStream.on('data', function(rowObj){
      console.log('> row', rowObj.merchant_name);
      CSVWriteStream.write({
        name: rowObj.merchant_name + ' - ' + rowObj.merchant_market_hierarchy_id,
        address: rowObj.address_cleansed,
        city: rowObj.city_name_cleansed,
        state: rowObj.state_province_code_cleansed,
        zipcode: rowObj.postal_code_cleansed,
        country: rowObj.country_code_cleansed,
        latitude: rowObj.latitude,
        longitude: rowObj.longitude,
        length: 100,
        label: 'starbucks;coffeeshop;'+StringUtil.replaceAllStr(StringUtil.replaceAllStr(StringUtil.replaceAllStr(rowObj.city_name_cleansed,'#',''),'  ',' '),' ','-')
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