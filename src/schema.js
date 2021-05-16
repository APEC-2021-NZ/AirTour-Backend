import { GraphQLFileLoader, loadTypedefsSync, mergeResolvers } from 'graphql-tools';
import path from 'path';
import { UserResolver } from './resolvers/UserResolver';

export const typeDefs = loadTypedefsSync(path.join(__dirname, 'schema.gql'), {
    loaders: [
        new GraphQLFileLoader()
    ]
}).map(src => src.document);

export const resolvers = mergeResolvers([
    UserResolver
])
