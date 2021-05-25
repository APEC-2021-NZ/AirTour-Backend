import { Language } from '../models/Guide'

const modelToLanguage = (language) => ({
    key: language.key,
    id: language.id,
    name: language.name,
})

const modelsToLanguages = (languages) => languages.map(modelToLanguage)

const LanguageResolver = {
    Query: {
        languages: async (parent, args, context, info) => {
            const languages = (await Language.collection.fetch()).list
            return modelsToLanguages(languages)
        },
    },
}

export { modelToLanguage, modelsToLanguages }
export default LanguageResolver
