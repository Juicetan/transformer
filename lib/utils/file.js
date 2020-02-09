var FS = require('fs');

var Deferred = require('../models/deferred');
var Validation = require('../models/validation');

var FileUtil = {
  checkFile: function(path, isDirectory){
    var def = new Deferred();
    var validation = new Validation();
    
    FS.stat(path, function(err, stats){
      if(!err){
        var isDir = stats.isDirectory();
        if(isDirectory && !isDir){
          def.reject(validation.addError('Path not a directory','',{
            code: Validation.type.INVALIDARG,
            context: path
          }));
        } else{
          def.resolve();
        }
      } else if(err.code === 'ENOENT'){
        validation.addError('Path not found','',{
          code: Validation.type.NOTFOUND,
          context: path
        });
        def.reject(validation);
      } else{
        validation.addError('Unknown error','',{
          code: Validation.type.UNEXPECTED,
          context: path
        });
        def.reject(validation);
      }
    });

    return def.promise;
  },
  checkDirectory: function(path){
    return this.checkFile(path, true);
  }
};

module.exports = FileUtil;