import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		field: {
			type: GraphQLString,
		},
	},
});

export default new GraphQLSchema({
	query,
});
