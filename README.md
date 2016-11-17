# babel-plugin-fetch-relay-schema

This plugin is a thin wrapper around ``babel-relay-plugin`` that fetches the graphql schema from a graphql server before running. Fetching is synchronous and will fail with a timeout after 30 seconds.

## Usage
Set the environment variable GRAPHQL_URL to the fully qualified URL to the graphql endpoint before running babel.

For example:  
``GRAPHQL_URL=http://localhost:8000/graphql node start``

## Options

### Schema cache time to live (experimental)
You can set the environment variable GRAPHQL\_SCHEMA\_CACHE\_TTL to the number of milliseconds the schema cache should stay. Only do this in development mode, as it will slow down builds. Note that this relies on implementation details of getBabelRelayPlugin and may potentially break when the plugin is updated.

# TODO
* Implement a retry mechanism for querying the schema - right now failures will just break it!
