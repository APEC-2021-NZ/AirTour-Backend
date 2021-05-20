import User from '../models/User';
import admin from 'firebase-admin';

const UserResolver = {

    Guide: async (parent, args, context, info) => {
        await Guide.collection.get({id: parent.id})
    },

    Query: {
        me: async (parent, args, context, info) => {
            if (!context.user) return;
            let a = await User.collection.get({ id: context.user.uid });
            // console.log(a)
            // console.log(a.list[0])
            // console.log(a.list[0].dob)
            console.log(a);
            // return a.list[1];
            return {
                id: a.id,
                firstname: 'test',
                surname: 'test',
                image: 'test',
                dob: new Date()
            };
        }
    },
    Mutation: {
        createUser: async (parent, { input }, context, info) => {
            if (!context.user) return;
            let { firstname, surname, image, dob } = input;

            let user = User.init();
            user.id = context.user.uid;
            user.firstname = firstname;
            user.surname = surname;
            // user.image = image.url;
            user.dob = dob;
            console.log(user);
            await user.save();
            console.log(user);
            return user;
        },
        updateUser: async (parent, { input }, context, info) => {
            // TODO
        }
    }
};

export default UserResolver;