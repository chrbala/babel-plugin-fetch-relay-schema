# babel-plugin-fetch-relay-schema

This plugin is a thin wrapper around ``babel-relay-plugin`` that fetches the graphql schema from a graphql server before running. Fetching is synchronous and will fail with a timeout after 30 seconds.

# Usage
Set the environment variable GRAPHQL_URL to the fully qualified URL to the graphql endpoint before running babel.

For example:  
``GRAPHQL_URL=http://localhost:8000/graphql node start``