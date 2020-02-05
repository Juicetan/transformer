
var StringUtil = {
  replaceAllStr: function(str, search, replacement){
    return str.split(search).join(replacement);
  }
};

module.exports = StringUtil;