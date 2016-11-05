var relaySchemaPath = __dirname + 'relaySchema';
var chalk = require('chalk');

var exec = require('child_process').execFileSync;
var getBabelRelayPlugin = require('babel-relay-plugin');

var requireGraphQlConfig = function() {
	var url = process.env.REACT_APP_GRAPHQL_URL;
  if (!url) {
    var errorMessage = chalk.red('Relay requires a url to your graphql server\n') +
      'Specifiy this in a ' + chalk.cyan('REACT_APP_GRAPHQL_URL') + ' environment variable.';
    throw new Error(errorMessage);
  }

  return url;
}

var validate = function(schema) {
	try {
    var graphQLSchema = graphQlutilities.buildClientSchema(schema.data);
    return schema;
  } catch (err) {
    var errorMessage = chalk.red('Could not parse the contents of schema.json into a valid graphql schema that is compatiable with this version of Relay and babel-relay-plugin\n') +
      'Upgrading graphql library on your server may be a solution.';
    throw new Error(errorMessage);
  }
}

var schemaBuffer
try {
	schemaBuffer = exec('node', [require('./fetchSchema'), requireGraphQlConfig()]);	
} catch (e) {
	throw new Error(chalk.red('Error fetching schema: ') + e.message);
}

var schema = JSON.parse(schemaBuffer.toString('utf8'));	

module.exports = getBabelRelayPlugin(schema.data)
