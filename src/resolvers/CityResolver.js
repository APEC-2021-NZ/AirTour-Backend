import { City } from '../models/Location'
import { getCountry } from './GuideResolver'

const modelToCity = (city) => ({
    key: city.key,
    id: city.id,
    name: city.name,
    countryID: city.country.ref.id,
})

const modelsToCitys = (citys) => citys.map(modelToCity)

const CityResolver = {
    City: {
        country: async (parent) => {
            return await getCountry(parent.countryID)
        },
    },
    Query: {
        citys: async (parent, args, context, info) => {
            const citys = (await City.collection.fetch()).list
            return modelsToCitys(citys)
        },
    },
}

export { modelToCity, modelsToCitys }
export default CityResolver
