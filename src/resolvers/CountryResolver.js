import { Country } from '../models/Location'

const modelToCountry = (country) => ({
    key: country.key,
    id: country.id,
    name: country.name,
})

const modelsToCountrys = (countrys) => countrys.map(modelToCountry)

const CountryResolver = {
    Query: {
        countrys: async (parent, args, context, info) => {
            const countrys = (await Country.collection.fetch()).list
            return modelsToCountrys(countrys)
        },
    },
}

export { modelToCountry, modelsToCountrys }
export default CountryResolver
