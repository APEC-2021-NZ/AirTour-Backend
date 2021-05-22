import { Destination } from '../models/Guide';

const modelToDestination = (destination) => ({
    key: destination.key,
    id: destination.id,
    name: destination.name,
    image: {
        uri: destination.image,
    },
});

const modelToDestinations = (destinations) =>
    destinations.map(modelToDestination);

const DestinationResolver = {
    Query: {
        destinations: async (parent, args, context, info) => {
            const destinations = (await Destination.collection.fetch()).list;
            return modelToDestinations(destinations);
        },
        searchDestinations: async (parent, { input }, context, info) => {
            // Search prefix using index name alphabetically
            const destinations = (
                await Destination.collection
                    .where('name', '>=', input)
                    .where('name', '<=', input + '\uf8ff')
                    .fetch()
            ).list;
            return modelToDestinations(destinations);
        },
    },
};

export default DestinationResolver;
