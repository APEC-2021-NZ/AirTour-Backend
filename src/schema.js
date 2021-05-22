import { GraphQLScalarType, Kind } from 'graphql'
import {
    GraphQLFileLoader,
    loadTypedefsSync,
    mergeResolvers,
} from 'graphql-tools'
import path from 'path'
import { GraphQLUpload } from 'graphql-upload'
import {
    BookingResolver,
    ConversationResolver,
    DestinationResolver,
    ExperienceResolver,
    GuideResolver,
    MessageResolver,
    ReviewResolver,
    TagResolver,
    UserResolver,
    WishlistResolver,
} from './resolvers'

export const typeDefs = loadTypedefsSync(path.join(__dirname, 'schema.gql'), {
    loaders: [new GraphQLFileLoader()],
}).map((src) => src.document)

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString()
        } else {
            // Assume it's a Timestamp
            // See: https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
            return value.toDate().toISOString()
        }
    },
    parseValue(value) {
        return new Date(value)
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value)
        }
        return null
    },
})

const dateTimeScalar = new GraphQLScalarType({
    name: 'DateTime',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString()
        } else {
            // Assume it's a Timestamp
            // See: https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
            return value.toDate().toISOString()
        }
    },
    parseValue(value) {
        return new Date(value)
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value)
        }
        return null
    },
})

const customScalars = {
    Date: dateScalar,
    DateTime: dateTimeScalar,
    Upload: GraphQLUpload,
}

export const resolvers = mergeResolvers([
    customScalars,
    BookingResolver,
    ConversationResolver,
    DestinationResolver,
    ExperienceResolver,
    GuideResolver,
    MessageResolver,
    ReviewResolver,
    TagResolver,
    UserResolver,
    WishlistResolver,
])
