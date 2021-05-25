import { City } from '../models/Location'

const modelToCity = (city) => ({
    key: city.key,
    id: city.id,
    name: city.name,
})

const modelsToCitys = (citys) => citys.map(modelToCity)

const CityResolver = {
    Query: {
        citys: async (parent, args, context, info) => {
            const citys = (await City.collection.fetch()).list
            return modelsToCitys(citys)
        },
    },
}

export { modelToCity, modelsToCitys }
export default CityResolver
