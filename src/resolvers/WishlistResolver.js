import { AuthenticationError } from 'apollo-server-errors';
import Guide from '../models/Guide';
import User from '../models/User';
import { getGuide } from '../resolvers/GuideResolver';

const WishlistResolver = {
    Mutation: {
        addToWishlist: async (parent, { guideID }, context, info) => {
            if (!context.user) throw new AuthenticationError();

            let user = await User.collection.get({ id: context.user.uid });
            let guide = await Guide.collection.get({ id: guideID });

            if (!user.wishlist) {
                user.wishlist = [guide.id];
            } else if (!user.wishlist.includes(guide.id)) {
                user.wishlist = [...user.wishlist, guide.id];
            }

            user.dob = user.dob.toDate();
            user.guide = user.guide.ref;

            await user.upsert();

            return getGuide(guide.id);
        }
    }
};

export default WishlistResolver;
