var Path = require('path');

var yargs = require('yargs');

var Validation = require('./lib/models/validation');
var FileUtil = require('./lib/utils/file');
var ParseController = require('./lib/controllers/parser');
var ConfigController = require('./lib/controllers/config');

yargs.command('transform <source> [destination]','Transform your flat delimited flat files', function(yargs){
  yargs.positional('source', {
    describe: 'Path to source file to be transformed.',
    type: 'string'
  }).positional('destination', {
    describe: 'Path to destination to place transformed file.',
    type: 'string',
    default: __dirname
  });
}, function(argv){
  var validation = new Validation();
  FileUtil.checkFile(argv.source).then(function(){
    return FileUtil.checkDirectory(argv.destination, true);
  }).then(function(){
    console.log('> config', argv.config);
    var filename = Path.basename(argv.source);
    var filenameSplit = filename.split('.');
    filename = filenameSplit[0]+'-autobot-'+Date.now()+'.'+filenameSplit[1];
    
    // ParseController.parse(argv.source, argv.destination+'/'+filename);
  }).catch(function(e){
    console.log('> ',e);
  });
});

yargs.option('config', {
  alias: 'c',
  describe: 'Path to configuration file.  If none is provided the current working directory'
})


yargs.help().argv;