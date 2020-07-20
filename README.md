# etlbot

A Node JS command line tool to perform transformations on delimited value flat files.

## Installation

```bash
$ npm install -g etlbot
```

## Basic Usage

### config

Create an instance of a configuration file from the built in template.

```bash
$ etlbot config [destination]
```

**Parameters**

| Name | Optional | Example | Description |
| ---- | -------- | ------- | ----------- |
| destination | true | `./mystuffFolder` | Path to destination folder to which an instance of the templated configuration file will be created. |

### transform

Transform delimited flat files from specified source using configuration file.

```bash
$ etlbot transform <source> [destination] --config=[path]
```

**Parameters**

| Name | Optional | Example | Description |
| ---- | -------- | ------- | ----------- |
| source | false | `../listOfStuff.csv` | Path to source file to parse from. |
| destination | true | `./mystuffFolder` | Path to destination folder to which the transformed file will be placed.  Note that if you do not provide a destination path the current working directory will be used. |

**Options**
| Name | Optional | Example | Description |
| ---- | -------- | ------- | ----------- |
| -c, --config | true | `--config=../pathToConfig/etlbot_config.js` | Optional path to configuration file defining the transformation.  Note if a configuration file path is not provided etlbot will look in the current working directory for etlbot_config.js. |


## Configuration File Example

The configuration file is split into two main sections: the `parse` object defines details required to parse the source file, whereas the `destination` object defines the required transformations.

```javascript
var DefaultConfig = {
  parse: {
    delimiter: ',',
    maxRows: null
  },
  transform: {
    delimiter: ',',
    fieldMap: [
      // Note that order of fieldKeys is relevant
      {
        key: 'newKeyName',
        value: function(rowObj){
          return // transformation
        }
      },{
        key: 'anotherKeyName',
        value: 10,
        static: true
      },{
        key: 'oneMoreKeyName',
        value: 'sourceKeyName'
      }
    ]
  }
};

module.exports = DefaultConfig;
```

| Name | Optional | Example | Description |
| ---- | -------- | ------- | ----------- |
| `parse.delimiter` | true | `','` | Delimiter in source file by which to parse. |
| `parse.maxRows` | true | `100` | Number of rows to parse.  If no value is provided then the whole source file will be parsed. |
| `transform.delimiter` | true | `','` | Delimiter in destination file by which to write with. |
| `transform.fieldMap` | false | `[...]` | An array of field definitions to transform to. |

**Field Definition**

| Name | Optional | Example | Description |
| ---- | -------- | ------- | ----------- |
| `key` | false | `newKeyName` | Key name for destination file column header. |
| `value` | false | `sourceKeyName`, `100`, `function(rowObj){...}` | If the value is a `String` without the `static` flag to be `true` then it is considered the key name of the column header in the source file and thus the value will be mapped accordingly.  If the value is a function then each row object from the source file will be passed through this function for the purposes of populating the value for the destination `key` specified. If the `static` flag is set to `true` then the value will be taken as is. |
| `static` | true | `true` | Flag to indicate that the value provided should be taken as is and placed as the column row value. |