var chalk = require('chalk');

var exec = require('child_process').execFileSync;
var getBabelRelayPlugin = require('babel-relay-plugin');
var graphQlutilities = require('graphql/utilities');
var join = require('path').join;

var validate = function(schema) {
	try {
    var graphQLSchema = graphQlutilities.buildClientSchema(schema.data);
  } catch (err) {
    var errorMessage = chalk.red('Could not parse the contents of schema.json into a valid graphql schema that is compatiable with this version of Relay and babel-relay-plugin\n') +
      'Upgrading graphql library on your server may be a solution.';
    throw new Error(errorMessage);
  }
}

var fetchSchema = () => {
	var url = process.env.GRAPHQL_URL;
	var path = process.env.GRAPHQL_PATH;

	if (url && path)
		throw new Error(`Only one of ${chalk.cyan('GRAPHQL_URL')} and ${chalk.cyan('GRAPHQL_PATH')} may be provided`);
	
	var getSchemaBuffer;
	if (path) {
		var fullPath = join(process.cwd(), path);
		getSchemaBuffer = () => exec('node', [require.resolve('./generateSchema'), fullPath]);
	} else if (url)
		getSchemaBuffer = () => exec('node', [require.resolve('./fetchSchema'), url]);
	else
		throw new Error(chalk.red('Relay requires a url to your graphql server\n') +
      'Specifiy this in a ' + chalk.cyan('GRAPHQL_URL') + ' or ' + chalk.cyan('GRAPHQL_PATH') + ' environment variable.');

	var schemaBuffer;
	try {
		schemaBuffer = getSchemaBuffer();
	} catch (e) {
		throw new Error(chalk.red('Error fetching schema: ') + e.message);
	}

	try {
		var schema = JSON.parse(schemaBuffer.toString('utf8'));	
		validate(schema);
		return schema;
	} catch (e) {
		throw new Error(`Error parsing schema: ${e.message}`);
	}
}

function fetchRelaySchemaDevPlugin() {
	var PluginBuilder = () => {
		var cache = null;
		var cacheTime = 0;
		return () => {
			var TTL = process.env.GRAPHQL_SCHEMA_CACHE_TTL;
			if (Date.now() - cacheTime > TTL) {
				cache = getBabelRelayPlugin(fetchSchema().data).apply(null, arguments);
				cacheTime = Date.now();
			}
			return cache.visitor;
		}
	}

	var plugin = PluginBuilder();
	var Program = plugin().Program;
	
	return {
		visitor: {
			Program,
			TaggedTemplateExpression: function() {
				var TaggedTemplateExpression = plugin().TaggedTemplateExpression;
				return TaggedTemplateExpression.apply(null, arguments);
			}
		}
	};
};

module.exports = process.env.GRAPHQL_SCHEMA_CACHE_TTL
	? fetchRelaySchemaDevPlugin
	: getBabelRelayPlugin(fetchSchema().data)
;
