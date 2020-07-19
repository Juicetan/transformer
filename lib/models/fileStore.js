var Persistence = require('node-persist');

var FileStore = (function(){
  function FileStore(path){
    this.storage = Persistence.create({
      dir: path
    });
    this.storage.initSync();
  };

  FileStore.prototype.getItem = function(key){
    return this.storage.getItemSync(key);
  };
  FileStore.prototype.setItem = function(key, value){
    if(!value){
      return this.removeItem(key);
    } else{
      return this.storage.setItemSync(key,value);
    }
  };
  FileStore.prototype.removeItem = function(key){
    return this.storage.removeItemSync(key);
  };
  FileStore.prototype.getKeys = function(){
    return Promise.resolve(this.storage.keys());
  };
  FileStore.prototype.clearAll = function(){
    return this.storage.clear();
  };

  return FileStore;

})();

module.exports = FileStore;