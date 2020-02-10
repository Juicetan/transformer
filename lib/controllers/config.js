var FS = require('fs');
var Path = require('path');

var DefaultConfig = require('../../res/config');
var Deferred = require('../models/deferred');

var ConfigController = {
  FILENAME: 'transformer_config.json',
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
  },
  createConfig: function(path){
    path += '/'+this.FILENAME;
    try{
      FS.writeFileSync(path, JSON.stringify(DefaultConfig, null, 2));
      console.log('> Configuration file created.', path);
    } catch(e){
      console.log('> failed to create configuration file.', e);
    }
  }
};

module.exports = ConfigController;