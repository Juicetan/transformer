var FS = require('fs');

var DefaultConfig = require('../../res/config');
var Deferred = require('../models/deferred');

var ConfigController = {
  resolveConfig: function(path){
    var config = DefaultConfig;
    if(path){
      try{
        var data = FS.readFileSync(path);
      } catch(e){
        
      }
    }

  }  
};

module.exports = ConfigController;