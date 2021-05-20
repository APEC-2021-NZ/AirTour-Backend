import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import admin from 'firebase-admin';
import auth from './middleware/auth';
import { resolvers, typeDefs } from './schema';
import { graphqlUploadExpress } from 'graphql-upload';

dotenv.config();

const PORT = process.env.PORT;

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "gs://apec-2021-nz.appspot.com"
});

const file = admin.storage().bucket().file('fizz/buzz.png');
const contents = 'This is the contents of the file.';

//-
// If the callback is omitted, we'll return a Promise.
//-
file.save(contents)

// // See: https://www.apollographql.com/docs/apollo-server/integrations/middleware/#applying-middleware
// async function startApolloServer() {
//     const app = express();
//     const server = new ApolloServer({
//         typeDefs,
//         resolvers,
//         mocks: true,
//         mockEntireSchema: false,
//         // See: https://www.apollographql.com/docs/apollo-server/data/file-uploads/#uploads-in-node-14-and-later
//         uploads: false,
//         context: auth()
//     });
//     await server.start();

//     app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

//     server.applyMiddleware({ app });

//     await new Promise((resolve) => app.listen({ port: PORT }, resolve));
//     console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
//     return { server, app };
// }

// startApolloServer();
