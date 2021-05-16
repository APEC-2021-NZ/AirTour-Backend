import { ApolloServer } from 'apollo-server';
import { resolvers, typeDefs } from './schema';
import admin from 'firebase-admin'

const serviceAccount = require('../firestore.creds.json');

// See: https://firebase.google.com/docs/firestore/quickstart#initialize
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  mocks: true,
  mockEntireSchema: false 
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

