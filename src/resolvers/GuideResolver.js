import { saveImage } from '../lib/storage';
import Guide, { Destination, Experience, Language, Tag } from '../models/Guide';
import { City } from '../models/Location';
import User from '../models/User';

const getGuide = async (id) => {
    let guide = await Guide.collection.get({ id });
    return {
        id: guide.id,
        active: guide.active,
        blurb: guide.blurb,
        description: guide.description,
        rating: guide.rating,
        numReviews: guide.numReviews,
        price: guide.price,
        city: guide.city,
        languages: guide.languages,
        experiences: guide.experiences,
        destinations: guide.destinations,
        tags: guide.tags
    };
};

const GuideResolver = {
    Query: {
        guide: async (parent, { guideID }, context, info) => {
            return getGuide(guideID);
        },
        guides: async (parent, { experienceID, placeID, tagID, onWishlist }, context, info) => {
            // Anyone can search, but only authenticated users can filter by whether a guide is on their wishlist

            let guides = Guide.collection.fetch();
        }
    },
    Guide: {
        city: async (parent) => {
            return await parent.city.get();
        },
        languages: async (parent) => {
            return await Promise.all(parent.languages.map((key) => Language.collection.get({ key })));
        },
        experiences: async (parent) => {
            let experiences = await Promise.all(parent.experiences.map((key) => Experience.collection.get({ key })));
            return experiences.map((exp) => ({
                id: exp.id,
                name: exp.name,
                image: {
                    uri: exp.image
                }
            }));
        },
        destinations: async (parent) => {
            let destinations = await Promise.all(parent.destinations.map((key) => Destination.collection.get({ key })));
            return destinations.map((dest) => ({
                id: dest.id,
                name: dest.name,
                image: {
                    uri: dest.image
                }
            }));
        },
        tags: async (parent) => {
            let tags = await Promise.all(parent.tags.map((key) => Tag.collection.get({ key })));
            return tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
                image: {
                    uri: tag.image
                }
            }));
        }
    },
    City: {
        country: async (parent) => {
            let ref = await parent.country.get();
            let data = await ref.data();
            return {
                id: ref.id,
                name: data.name
            };
        }
    },
    Mutation: {
        createGuide: async (parent, { input }, context, info) => {
            if (!context.user) return;

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
                tagIDs
            } = input;

            let city = await City.collection.get({ id: cityID });
            let languages = await Promise.all(languageIDs.map((id) => Language.collection.get({ id })));
            let experiences = await Promise.all(experienceIDs.map((id) => Experience.collection.get({ id })));
            let destinations = await Promise.all(destinationIDs.map((id) => Destination.collection.get({ id })));
            let tags = await Promise.all(tagIDs.map((id) => Tag.collection.get({ id })));

            let languageKeys = languages.map((lang) => lang.key);
            let experienceKeys = experiences.map((exp) => exp.key);
            let destinationKeys = destinations.map((dest) => dest.key);
            let tagKeys = tags.map((tag) => tag.key);

            let user = await User.collection.get({ id: context.user.uid });
            let guide = Guide.init();
            guide.id = context.user.uid;
            guide.user = user.key;
            guide.active = active;
            guide.image = await saveImage(image);
            guide.city = city.key;
            guide.blurb = blurb;
            guide.description = description;
            guide.rating = 5;
            guide.numReviews = 0;
            guide.price = price;
            guide.languages = languageKeys;
            guide.experiences = experienceKeys;
            guide.destinations = destinationKeys;
            guide.tags = tagKeys;

            await guide.save();

            return await getGuide(guide.id);
        },
        updateGuide: async (parent, { input }, context, info) => {
            if (!context.user) return;

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
                tagIDs
            } = input;

            let guide = Guide.collection.get({ id: context.user.id });
            guide.active = active ? active : guide.active;
            guide.image = image ? await saveImage(image) : guide.image;
            guide.blurb = blurb ? blurb : guide.blurb;
            guide.description = description ? description : guide.description;
            guide.price = price ? price : guide.price;

            if (city) {
                let city = await City.collection.get({ id: cityID });
                guide.city = city.key;
            }

            if (languageIDs) {
                let languages = await Promise.all(languageIDs.map((id) => Language.collection.get({ id })));
                let languageKeys = languages.map((lang) => lang.key);
                guide.languages = languageKeys;
            }

            if (experienceIDs) {
                let experiences = await Promise.all(experienceIDs.map((id) => Experience.collection.get({ id })));
                let experienceKeys = experiences.map((exp) => exp.key);
                guide.experiences = experienceKeys;
            }

            if (destinationIDs) {
                let destinations = await Promise.all(destinationIDs.map((id) => Destination.collection.get({ id })));
                let destinationKeys = destinations.map((dest) => dest.key);
                guide.destinations = destinationKeys;
            }

            if (tagIDs) {
                let tags = await Promise.all(tagIDs.map((id) => Tag.collection.get({ id })));
                let tagKeys = tags.map((tag) => tag.key);
                guide.tags = tagKeys;
            }

            await guide.upsert();

            return await getGuide(guide.id);
        }
    }
};

export default GuideResolver;
