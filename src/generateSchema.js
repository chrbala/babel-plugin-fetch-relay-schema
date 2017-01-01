var graphql = require('graphql').graphql;
var graphQlutilities = require('graphql/utilities');

var path = process.argv[2];

var throwErrors = result => result.errors
	? Promise.reject(new Error(result.errors))
	: result
;
var success = result => console.log(JSON.stringify(result));
var error = err => {
	console.error(err.message);
	process.exit(1);
}

var schemaSource = require(path);
const runtimeSchema = schemaSource.default || schemaSource;
graphql(runtimeSchema, graphQlutilities.introspectionQuery)
	.then(throwErrors)
	.then(success)
	.catch(error)
;
