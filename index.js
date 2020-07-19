#!/usr/bin/env node

var Path = require('path');

var yargs = require('yargs');

var FileUtil = require('./lib/utils/file');
var ParseController = require('./lib/controllers/parser');
var ConfigController = require('./lib/controllers/config');
var CacheController = require('./lib/controllers/cache');
const Deferred = require('./lib/models/deferred');
const FS = require('fs');

yargs.command('transform <source> [destination]','Transform your delimited flat files', function(yargs){
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
      if(argv.config.charAt(0) === '.'){
        resolvedConfigPath = process.cwd() + '/' + resolvedConfigPath;
      }
    }
    return FileUtil.checkFile(resolvedConfigPath);
  }).then(function(){
    var filename = Path.basename(argv.source);
    var filenameSplit = filename.split('.');
    filename = filenameSplit[0]+'-etlbot-'+Date.now()+'.'+filenameSplit[1];
    
    var config = ConfigController.resolveConfig(resolvedConfigPath);
    ParseController.parse(argv.source, argv.destination+'/'+filename, config);
  }).catch(function(e){
    console.log('> ',e);
  });
});

yargs.command('cache <source> [destination]', 'Build a cache of key value pairs based on a delimited file to be used in subsequent ETL steps.', function(yargs){
  yargs.positional('source', {
    describe: 'Path to source file to be parsed.',
    type: 'string'
  }).positional('destination', {
    describe: 'Path to destination to place cache.',
    type: 'string'
  });
}, function(argv){
  var resolvedConfigPath;
  var resolvedCachePath;

  FileUtil.checkFile(argv.source).then(function(){
    var def = new Deferred();
    resolvedCachePath = argv.destination;
    if(!resolvedCachePath){
      resolvedCachePath = Path.join(process.cwd(),CacheController.FOLDERNAME);
      console.log('> No cache directory provided. Using default:', resolvedCachePath);
    }

    FileUtil.checkDirectory(resolvedCachePath).then(function(){
      console.log('> Existing cache directory found', resolvedCachePath);
      def.resolve();
    }).catch(function(e){
      console.log('> directory not found', resolvedCachePath);
      console.log('> creating cache directory', resolvedCachePath);
      FS.mkdirSync(resolvedCachePath);
      def.resolve();
    });
    return def.promise;
  }).then(function(){
    resolvedConfigPath = process.cwd()+'/'+ConfigController.FILENAME;
    if(argv.config){
      resolvedConfigPath = argv.config;
      if(argv.config.charAt(0) === '.'){
        resolvedConfigPath = process.cwd() + '/' + resolvedConfigPath;
      }
    }
    return FileUtil.checkFile(resolvedConfigPath);
  }).then(function(){
    var config = ConfigController.resolveConfig(resolvedConfigPath);
    CacheController.build(argv.source, resolvedCachePath, config);
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