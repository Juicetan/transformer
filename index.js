var Path = require('path');

var yargs = require('yargs');
var ParseController = require('./lib/controllers/parser');

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
  var filename = Path.basename(argv.source);
  var filenameSplit = filename.split('.');
  filename = filenameSplit[0]+'-autobot-'+Date.now()+'.'+filenameSplit[1];
  ParseController.parse(argv.source, argv.destination+'/'+filename);
});


yargs.help().argv;