var FS = require('fs');
var Path = require('path');

var DefaultConfig = require('../../res/config');
var Deferred = require('../models/deferred');

var ConfigController = {
  FILENAME: 'transformer_config.js',
  resolveConfig: function(path){
    try{
      var data = require(path);
      console.log('> configuration parsed', path);
      return data;
    } catch(e){
      console.log('> cannot parse config', e);
      return;
    }
  },
  createConfig: function(path){
    path += '/'+this.FILENAME;
    try{
      FS.copyFile('../../res/config.js', path, function(err){
        if(err){
          console.log('> failed to create configuration file.', err);
        } else{
          console.log('> Configuration file created.', path);
        }
      });
    } catch(e){
      console.log('> failed to create configuration file.', e);
    }
  }
};

module.exports = ConfigController;