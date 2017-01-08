# babel-plugin-fetch-relay-schema

This plugin is a thin wrapper around ``babel-relay-plugin`` that fetches the graphql schema from a graphql server or from a schema file. You can get the schema via URL or path to the runtime schema.

## Usage

### Via GRAPHQL_URL
Set the environment variable GRAPHQL_URL to the fully qualified URL to the graphql endpoint before running babel. Fetching is synchronous and will fail with a timeout after 30 seconds.

For example:  
``GRAPHQL_URL=http://localhost:8000/graphql node start``

### Via GRAPHQL_PATH
Set the path to the file containing the graphql schema. This file must export ES5. This plugin will bail when there is a cycle in the dependencies – that is, if GRAPHQL_PATH=schema.js, you can transform schema.js and its dependencies without creating an infinite dependency loop.

For example:  

```javascript
/* schema.babel.js */
const query = new GraphQLObjectType({...});
const mutation = new GraphQLObjectType({...});
export default new GraphQLSchema({
	query,
	mutation,
});

/* schema.js */
require('babel-core/register');
Object.assign(exports, require('./schema.babel'));
```

Then run:
``GRAPHQL_PATH=./schema.js node start``

### When is best to use GRAPHQL_PATH and GRAPHQL_URL?
I suggest using the URL if you don't have a good reason to use the path. I use path option alongside my mock schema for a completely offline testable UI. For all other use cases (integration testing and final builds), I use the URL for the environment that the build will ultimately be run against.

## Options

### Schema cache time to live
You can set the environment variable GRAPHQL\_SCHEMA\_CACHE\_TTL to the number of milliseconds the schema cache should stay. Only do this in development mode, as it will slow down builds.

GRAPHQL\_SCHEMA\_CACHE\_TTL applies to both GRAPHQL\_URL and GRAPHQL\_PATH usages.
