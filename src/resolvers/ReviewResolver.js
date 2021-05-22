import User from '../models/User';
import Booking from '../models/Booking';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import Guide from '../models/Guide';
import Review from '../models/Review';
import { Fireo } from 'fireo';
import { DoubleReviewError, NoBookingReviewError } from '../errors/ReviewError';

const getReview = async ({ reviewId, guideId }) => {
    let review = await Review.collection.parent(guideId).get({ id: reviewId });
    return {
        id: review.id,
        guide: review.guide,
        tourist: review.tourist,
        rating: review.rating,
        description: review.description,
        created: review.created
    };
};

const ReviewResolver = {
    Review: {
        guide: async (parent) => {
            return await parent.guide.get();
        }
    },
    Mutation: {
        review: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError();

            let { guideID, rating, description } = input;

            let result = await Fireo.runTransaction(async (transaction) => {
                let guide = await Guide.collection.get({ id: guideID, transaction });
                let user = await User.collection.get({ id: context.user.uid, transaction });

                // Users should only be able review guides that they've completed a booking with
                let booking = await Booking.collection
                    .where('tourist', '==', user.key)
                    .where('guide', '==', guide.key)
                    .where('confirmedTourist', '==', true)
                    .where('confirmedGuide', '==', true)
                    .where('endTime', '<', new Date())
                    .get({ transaction });

                if (!booking) throw new NoBookingReviewError();

                // Users cannot create more than one booking
                let existingReview = await Review.collection
                    .parent(guide.key)
                    .where('tourist', '==', user.key)
                    .get({ transaction });

                if (!existingReview) throw new DoubleReviewError();

                if (rating < 1 || rating > 5) throw new UserInputError('Rating must be between 0 and 5 (inclusive).');

                let review = Review.init({ parent: guide.key });
                review.guide = guide.key;
                review.tourist = user.key;
                review.rating = rating;
                review.description = description;
                review.created = new Date();

                // Update the guides review stats
                guide.user = (await guide.user.get({ transaction })).key;
                guide.city = (await guide.city.get({ transaction })).key;
                guide.ratingTotal += rating;
                guide.numReviews++;
                guide.rating = guide.ratingTotal / guide.numReviews;

                await guide.upsert({ transaction });
                await review.save({ transaction });

                return {
                    reviewId: review.id,
                    guideId: guide.key
                };
            });

            return await getReview(result);
        }
    }
};

export default ReviewResolver;
