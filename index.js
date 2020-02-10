var Path = require('path');

var yargs = require('yargs');

var FileUtil = require('./lib/utils/file');
var ParseController = require('./lib/controllers/parser');
var ConfigController = require('./lib/controllers/config');

yargs.command('* <source> [destination]','Transform your flat delimited flat files', function(yargs){
  yargs.positional('source', {
    describe: 'Path to source file to be transformed.',
    type: 'string'
  }).positional('destination', {
    describe: 'Path to destination to place transformed file.',
    type: 'string',
    default: process.cwd()
  });
}, function(argv){
  var resolvedConfigPath;

  FileUtil.checkFile(argv.source).then(function(){
    return FileUtil.checkDirectory(argv.destination, true);
  }).then(function(){
    resolvedConfigPath = process.cwd()+'/'+ConfigController.FILENAME;
    if(argv.config){
      resolvedConfigPath = argv.config;
    }
    return FileUtil.checkFile(resolvedConfigPath);
  }).then(function(){
    var filename = Path.basename(argv.source);
    var filenameSplit = filename.split('.');
    filename = filenameSplit[0]+'-autobot-'+Date.now()+'.'+filenameSplit[1];
    
    var config = ConfigController.resolveConfig(resolvedConfigPath);
    ParseController.parse(argv.source, argv.destination+'/'+filename, config);
  }).catch(function(e){
    console.log('> ',e);
  });
});

yargs.command('config [destination]', 'Create a configuration file for transformer.', function(yargs){
  yargs.positional('destination', {
    describe: 'Path to create configuration file template.',
    type: 'string',
    default: process.cwd()
  });
}, function(argv){
  FileUtil.checkFile(argv.destination, true).then(function(){
    ConfigController.createConfig(argv.destination);
  }).catch(function(e){
    console.log('> ', e);
  });
});

yargs.option('config', {
  alias: 'c',
  describe: 'Path to configuration file.  If none is provided the current working directory will be used.'
});


yargs.help().argv;