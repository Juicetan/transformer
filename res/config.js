
var DefaultConfig = {
  parse: {
    delimiter: ',',
    maxRows: null
  },
  transform: {
    delimiter: ',',
    fieldMap: [
      /**
       * // Note that order of fieldKeys is relevant
       *  {
       *    key: 'newKeyName',
       *    value: function(rowObj){
       *      return // transformation
       *    }
       *  },{
       *    key: 'anotherKeyName',
       *    value: 10,
       *    static: true
       *  },{
       *    key: 'oneMoreKeyName',
       *    value: 'originalKeyName'
       *  }
       */
    ]
  },
  cache: {
    fieldMap: [
      /**
       *  {
       *    key: 'cacheKey',
       *    value: function(rowObj, cache){
       *      return // value to cache
       *    },
       *    staticKey: true
       *  },{
       *    key: function(rowObj, cache){
       *      return // cache key
       *    },
       *    value: function(rowObj, cache){
       *      return // value to cache
       *    }
       *  },{
       *    key: 'oldCacheKeyReference'
       *    value: function(rowObj, cache){
       *      return // value to cache
       *    }
       *  },{
       *    key: 'anotherCacheKeyName',
       *    value: 10,
       *    static: true
       *  },{
       *    key: 'oneMoreCacheKeyName',
       *    value: 'originalKeyName'
       *  }
       */
    ]
  },
  filter: []
};

module.exports = DefaultConfig;