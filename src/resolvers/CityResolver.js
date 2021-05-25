import { City } from '../models/Location'
import { getCountry } from './GuideResolver'

const modelToCity = (city) => ({
    key: city.key,
    id: city.id,
    name: city.name,
    countryID: city.country.ref.id,
})

const modelsToCities = (cities) => cities.map(modelToCity)

const CityResolver = {
    City: {
        country: async (parent) => {
            return await getCountry(parent.countryID)
        },
    },
    Query: {
        cities: async (parent, args, context, info) => {
            const cities = (await City.collection.fetch()).list
            return modelsToCities(cities)
        },
    },
}

export { modelToCity, modelsToCities }
export default CityResolver
