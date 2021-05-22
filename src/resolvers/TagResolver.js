import { Tag } from '../models/Guide'

const modelToTag = (tag) => ({
    key: tag.key,
    id: tag.id,
    name: tag.name,
    image: {
        uri: tag.image,
    },
})

const modelsToTags = (tags) => tags.map(modelToTag)

const TagResolver = {
    Query: {
        tags: async (parent, args, context, info) => {
            const tags = (await Tag.collection.fetch()).list
            return modelsToTags(tags)
        },
    },
}

export { modelToTag, modelsToTags }
export default TagResolver
