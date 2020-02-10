
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
       *    }
       *  },{
       *    key: 'anotherKeyName',
       *    value: 10
       *  }
       */
    ]
  }
};

module.exports = DefaultConfig;