import User from '../models/User';
import admin from 'firebase-admin';

const WishlistResolver = {
    Mutation: {
        addToWishlist: async (parent, { guideID }, context, info) => {
            // TODO
        }
    }
};

export default WishlistResolver;