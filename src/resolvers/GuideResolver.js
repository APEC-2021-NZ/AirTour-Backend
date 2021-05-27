import { AuthenticationError } from 'apollo-server-errors'
import admin from 'firebase-admin'
import { Fireo } from 'fireo'
import { saveImage } from '../lib/storage'
import Guide, { Destination, Experience, Language, Tag } from '../models/Guide'
import { City, Country } from '../models/Location'
import Review from '../models/Review'
import User from '../models/User'
import { modelsToDestinations } from './DestinationResolver'
import { modelsToExperiences } from './ExperienceResolver'
import { modelsToTags } from './TagResolver'
import { getUser } from './UserResolver'

const modelToDto = (guide) => ({
    key: guide.key,
    id: guide.id,
    active: guide.active,
    blurb: guide.blurb,
    description: guide.description,
    rating: guide.rating,
    numReviews: guide.numReviews,
    price: guide.price,
    cityID: guide.city.ref.id,
    languageKeys: guide.languages,
    experienceKeys: guide.experiences,
    destinationKeys: guide.destinations,
    tagKeys: guide.tags,
    image: guide.image,
    userID: guide.user.ref.id,
})

const modelsToDtos = (guides) => guides.map(modelToDto)

export const getGuide = async (id) => {
    let guide = await Guide.collection.get({ id })
    return modelToDto(guide)
}

export const getCity = async (id) => {
    let city = await City.collection.get({ id })
    return {
        id,
        name: city.name,
        countryID: city.country.ref.id,
    }
}

export const getCountry = async (id) => {
    let country = await Country.collection.get({ id })
    return {
        id,
        name: country.name,
    }
}

export const getReviews = async (guideKey, offset, limit) => {
    let reviews = await Review.collection
        .parent(guideKey)
        .orderBy('-created')
        .fetch(offset + limit)
    return reviews.list.slice(offset).map((review) => ({
        id: review.id,
        guideID: review.guide.ref.id,
        touristID: review.tourist.ref.id,
        rating: review.rating,
        description: review.description,
        created: review.created,
    }))
}

const GuideResolver = {
    Query: {
        guide: async (parent, { guideID }, context, info) => {
            return getGuide(guideID)
        },
        guides: async (parent, { input }, context, info) => {
            // Anyone can search, but only authenticated users can filter by whether a guide is on their wishlist
            let { experienceID, placeID, tagID, onWishlist } = input
            if (onWishlist && !context.user) throw new AuthenticationError()

            let guides

            if (experienceID) {
                let experience = await Experience.collection.get({
                    id: experienceID,
                })
                guides = (
                    await Guide.collection
                        .where('experiences', 'array-contains-any', [
                            experience.key,
                        ])
                        .fetch()
                ).list
                return modelsToDtos(guides)
            }

            if (placeID) {
                let place = await Destination.collection.get({ id: placeID })
                guides = (
                    await Guide.collection
                        .where('destinations', 'array-contains-any', [
                            place.key,
                        ])
                        .fetch()
                ).list
                return modelsToDtos(guides)
            }

            if (tagID) {
                let tag = await Tag.collection.get({ id: tagID })
                guides = (
                    await Guide.collection
                        .where('tags', 'array-contains-any', [tag.key])
                        .fetch()
                ).list
                return modelsToDtos(guides)
            }

            if (onWishlist) {
                let user = await User.collection.get({ id: context.user.uid })
                if (user.wishlist) {
                    guides = await Promise.all(
                        user.wishlist.map((id) => Guide.collection.get({ id })),
                    )
                    return modelsToDtos(guides)
                }
                return []
            }

            guides = (await Guide.collection.fetch()).list
            return modelsToDtos(guides)
        },
    },
    Guide: {
        image: async (parent) => {
            return {
                uri: parent.image,
            }
        },
        city: async (parent) => {
            return await getCity(parent.cityID)
        },
        languages: async (parent) => {
            return await Promise.all(
                parent.languageKeys.map((key) =>
                    Language.collection.get({ key }),
                ),
            )
        },
        experiences: async (parent) => {
            let experiences = await Promise.all(
                parent.experienceKeys.map((key) =>
                    Experience.collection.get({ key }),
                ),
            )
            return modelsToExperiences(experiences)
        },
        destinations: async (parent) => {
            let destinations = await Promise.all(
                parent.destinationKeys.map((key) =>
                    Destination.collection.get({ key }),
                ),
            )
            return modelsToDestinations(destinations)
        },
        tags: async (parent) => {
            let tags = await Promise.all(
                parent.tagKeys.map((key) => Tag.collection.get({ key })),
            )
            return modelsToTags(tags)
        },
        reviews: async (parent, { limit = 10, offset = 0 }) => {
            return await getReviews(parent.key, offset, limit)
        },
        user: async (parent) => {
            return await getUser(parent.userID)
        },
        recommendations: async (parent) => {
            let city = await City.collection.get({ id: parent.cityID })
            const guides = (
                await Guide.collection
                    .where('city', '==', city.key)
                    .limit(2)
                    .fetch()
            ).list
            return modelsToDtos(guides)
        },
    },
    City: {
        country: async (parent) => {
            return await getCountry(parent.countryID)
        },
    },
    Mutation: {
        createGuide: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            let {
                active,
                image,
                cityID,
                blurb,
                description,
                price,
                languageIDs,
                experienceIDs,
                destinationIDs,
                tagIDs,
            } = input

            let city = await City.collection.get({ id: cityID })
            let languages = await Promise.all(
                languageIDs.map((id) => Language.collection.get({ id })),
            )
            let experiences = await Promise.all(
                experienceIDs.map((id) => Experience.collection.get({ id })),
            )
            let destinations = await Promise.all(
                destinationIDs.map((id) => Destination.collection.get({ id })),
            )
            let tags = await Promise.all(
                tagIDs.map((id) => Tag.collection.get({ id })),
            )

            let languageKeys = languages.map((lang) => lang.key)
            let experienceKeys = experiences.map((exp) => exp.key)
            let destinationKeys = destinations.map((dest) => dest.key)
            let tagKeys = tags.map((tag) => tag.key)

            let user = await User.collection.get({ id: context.user.uid })
            let guide = Guide.init()
            guide.id = context.user.uid
            guide.user = user.key
            guide.active = active
            guide.image = await saveImage(image)
            guide.city = city.key
            guide.blurb = blurb
            guide.description = description
            guide.rating = 5
            guide.numReviews = 0
            guide.price = price
            guide.languages = languageKeys
            guide.experiences = experienceKeys
            guide.destinations = destinationKeys
            guide.tags = tagKeys

            await guide.save()

            return await getGuide(guide.id)
        },
        updateGuide: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            let {
                active,
                image,
                cityID,
                blurb,
                description,
                price,
                languageIDs,
                experienceIDs,
                destinationIDs,
                tagIDs,
            } = input

            let guideID = await Fireo.runTransaction(async (transaction) => {
                let user = await User.collection.get({
                    id: context.user.uid,
                    transaction,
                })
                let guide = await Guide.collection.get({
                    id: context.user.uid,
                    transaction,
                })
                guide.user = user.key
                guide.active = active ? active : guide.active
                guide.image = image ? await saveImage(image) : guide.image
                guide.blurb = blurb ? blurb : guide.blurb
                guide.description = description
                    ? description
                    : guide.description
                guide.price = price ? price : guide.price

                if (cityID) {
                    let city = await City.collection.get({
                        id: cityID,
                        transaction,
                    })
                    guide.city = city.key
                }

                if (languageIDs) {
                    let languages = await Promise.all(
                        languageIDs.map((id) =>
                            Language.collection.get({ id, transaction }),
                        ),
                    )
                    let languageKeys = languages.map((lang) => lang.key)
                    guide.languages = languageKeys
                }

                if (experienceIDs) {
                    let experiences = await Promise.all(
                        experienceIDs.map((id) =>
                            Experience.collection.get({ id, transaction }),
                        ),
                    )
                    let experienceKeys = experiences.map((exp) => exp.key)
                    guide.experiences = experienceKeys
                }

                if (destinationIDs) {
                    let destinations = await Promise.all(
                        destinationIDs.map((id) =>
                            Destination.collection.get({ id, transaction }),
                        ),
                    )
                    let destinationKeys = destinations.map((dest) => dest.key)
                    guide.destinations = destinationKeys
                }

                if (tagIDs) {
                    let tags = await Promise.all(
                        tagIDs.map((id) =>
                            Tag.collection.get({ id, transaction }),
                        ),
                    )
                    let tagKeys = tags.map((tag) => tag.key)
                    guide.tags = tagKeys
                }

                await guide.upsert({ transaction })

                return guide.id
            })

            return await getGuide(guideID)
        },
    },
}

export default GuideResolver
