import { Destination } from '../models/Guide'
import { getCity } from './GuideResolver'

const modelToDestination = (destination) => ({
    key: destination.key,
    id: destination.id,
    name: destination.name,
    image: {
        uri: destination.image,
    },
    cityID: destination.city.ref.id,
})

const modelsToDestinations = (destinations) =>
    destinations.map(modelToDestination)

const DestinationResolver = {
    Destination: {
        city: async (parent) => {
            return await getCity(parent.cityID)
        },
    },
    Query: {
        destinations: async (parent, args, context, info) => {
            const destinations = (await Destination.collection.fetch()).list
            return modelsToDestinations(destinations)
        },
        searchDestinations: async (parent, { input = '' }, context, info) => {
            // Make the first letter for every word a capital
            const firstLetterCaps = input.replace(
                /(^\w{1})|(\s+\w{1})/g,
                (letter) => letter.toUpperCase(),
            )
            // Search prefix using index name alphabetically
            const destinations = (
                await Destination.collection
                    .where('name', '>=', firstLetterCaps)
                    .where('name', '<=', firstLetterCaps + '\uf8ff')
                    .fetch()
            ).list
            return modelsToDestinations(destinations)
        },
    },
}

export { modelsToDestinations, modelToDestination }
export default DestinationResolver
