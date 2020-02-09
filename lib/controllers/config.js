var FS = require('fs');

var DefaultConfig = require('../../res/config');
var Deferred = require('../models/deferred');

var ConfigController = {
  resolveConfig: function(path){
    try{
      var data = FS.readFileSync(path);
      data = JSON.stringify(data);
      console.log('> config parsed', data);
      return data;
    } catch(e){
      console.log('> cannot parse config');
      return;
    }
  }  
};

module.exports = ConfigController;