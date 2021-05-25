import { AuthenticationError } from 'apollo-server-errors'
import { Fireo } from 'fireo'
import Guide from '../models/Guide'
import User from '../models/User'
import { getGuide } from '../resolvers/GuideResolver'

const WishlistResolver = {
    Mutation: {
        addToWishlist: async (parent, { guideID }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            await Fireo.runTransaction(async (transaction) => {
                let user = await User.collection.get({
                    id: context.user.uid,
                    transaction,
                })
                let guide = await Guide.collection.get({
                    id: guideID,
                    transaction,
                })

                if (!user.wishlist) {
                    user.wishlist = [guide.id]
                } else if (!user.wishlist.includes(guide.id)) {
                    user.wishlist = [...user.wishlist, guide.id]
                }

                user.dob = user.dob.toDate()
                user.guide = user.guide.ref

                await user.upsert({ transaction })
            })

            return getGuide(guideID)
        },
    },
}

export default WishlistResolver
