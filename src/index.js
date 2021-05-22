import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import admin from 'firebase-admin';
import auth from './middleware/auth';
import { resolvers, typeDefs } from './schema';
import { graphqlUploadExpress } from 'graphql-upload';
import { City, Country } from './models/Location';
import { Destination, Experience, Language, Tag } from './models/Guide';

dotenv.config();

const PORT = process.env.PORT;

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: 'gs://apec-2021-nz.appspot.com'
});

async function loadData() {
    let country = Country.init();
    country.id = '1';
    country.name = 'New Zealand';
    await country.save();

    let city = City.init();
    city.id = '1';
    city.name = 'Auckland';
    city.country = country.key;
    await city.save();

    let city2 = City.init();
    city2.id = '2';
    city2.name = 'Wellington';
    city2.country = country.key;
    await city2.save();

    let language = Language.init();
    language.id = '1';
    language.name = 'English';
    await language.save();

    let language2 = Language.init();
    language2.id = '2';
    language2.name = 'Not English';
    await language2.save();

    let experience = Experience.init();
    experience.id = '1';
    experience.name = 'Skiing';
    experience.image = 'url';
    await experience.save();

    let experience2 = Experience.init();
    experience2.id = '2';
    experience2.name = 'Biking';
    experience2.image = 'url';
    await experience2.save();

    let destination = Destination.init();
    destination.id = '1';
    destination.name = 'Auckland Zoo';
    destination.image = 'url';
    destination.city = city.key;
    await destination.save();

    let destination2 = Destination.init();
    destination2.id = '2';
    destination2.name = 'Mission Bay';
    destination2.image = 'url';
    destination2.city = city2.key;
    await destination2.save();

    let tag = Tag.init();
    tag.id = '1';
    tag.name = 'National Parks';
    tag.image = 'url';
    await tag.save();

    let tag2 = Tag.init();
    tag2.id = '2';
    tag2.name = 'Beaches';
    tag2.image = 'url';
    await tag2.save();
}

// See: https://www.apollographql.com/docs/apollo-server/integrations/middleware/#applying-middleware
async function startApolloServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        // mocks: true,
        // mockEntireSchema: false,
        // See: https://www.apollographql.com/docs/apollo-server/data/file-uploads/#uploads-in-node-14-and-later
        uploads: false,
        context: auth()
    });
    await server.start();

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

    server.applyMiddleware({ app });

    await new Promise((resolve) => app.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    return { server, app };
}

loadData();
startApolloServer();
