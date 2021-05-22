import { Experience } from '../models/Guide'

const modelToExperience = (experience) => ({
    key: experience.key,
    id: experience.id,
    name: experience.name,
    image: {
        uri: experience.image,
    },
})

const modelsToExperiences = (experiences) => experiences.map(modelToExperience)

const ExperienceResolver = {
    Query: {
        experiences: async (parent, args, context, info) => {
            const experiences = (await Experience.collection.fetch()).list
            return modelsToExperiences(experiences)
        },
    },
}

export default ExperienceResolver
