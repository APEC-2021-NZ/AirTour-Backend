import { Country } from '../models/Location'

const modelToCountry = (country) => ({
    key: country.key,
    id: country.id,
    name: country.name,
})

const modelsToCountrys = (countries) => countries.map(modelToCountry)

const CountryResolver = {
    Query: {
        countries: async (parent, args, context, info) => {
            const countries = (await Country.collection.fetch()).list
            return modelsToCountrys(countries)
        },
    },
}

export { modelToCountry, modelsToCountrys }
export default CountryResolver
