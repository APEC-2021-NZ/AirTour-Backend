import { saveImage } from '../lib/storage';
import User from '../models/User';

export const getUser = async (id) => {
    let user = await User.collection.get({ id });
    return {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        image: {
            uri: user.image
        },
        dob: user.dob,
        guide: user.guide,
        conversations: user.conversations
    };
};

const UserResolver = {
    Query: {
        me: async (parent, args, context, info) => {
            if (!context.user) throw new AuthenticationError();
            return await getUser(context.user.uid);
        }
    },
    User: {
        guide: async (parent) => {
            // TODO: Test this
            let guide = parent.guide && parent.guide.ref ? await parent.guide.get() : null;
            return guide;
        },
        conversations: async (parent) => {
            // TODO: Test this
            let conversations = parent.conversations ? await Promise.all(parent.conversations.map((c) => c.get())) : [];
            return conversations;
        }
    },
    Mutation: {
        createUser: async (parent, { input }, context, info) => {
            // Should probably check to see if the user already exists
            if (!context.user) throw new AuthenticationError();
            let { firstname, surname, image, dob } = input;

            let user = User.init();
            user.id = context.user.uid;
            user.firstname = firstname;
            user.surname = surname;
            user.image = await saveImage(image);
            user.dob = dob;

            await user.save();

            return await getUser(context.user.uid);
        },
        updateUser: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError();

            let { firstname, surname, image, dob } = input;

            let user = await User.collection.get({ id: context.user.uid });
            user.firstname = firstname ? firstname : user.firstname;
            user.surname = surname ? surname : user.surname;
            user.dob = dob ? dob : user.dob.toDate();
            user.guide = user.guide.ref;
            user.image = image ? await saveImage(image) : user.image;

            await user.upsert();

            return await getUser(context.user.uid);
        }
    }
};

export default UserResolver;
