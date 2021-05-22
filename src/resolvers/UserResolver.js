import { AuthenticationError } from 'apollo-server-errors'
import { saveImage } from '../lib/storage'
import { Conversation } from '../models/Conversation'
import User from '../models/User'
import { getConversation } from './ConversationResolver'
import { getGuide } from './GuideResolver'

export const getUser = async (id) => {
    let user = await User.collection.get({ id })
    return {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        image: user.image,
        dob: user.dob,
        guideID: user.guide && user.guide.ref ? user.guide.ref.id : null,
        conversationIDs: user.conversations,
    }
}

const UserResolver = {
    Query: {
        me: async (parent, args, context, info) => {
            if (!context.user) throw new AuthenticationError()
            return await getUser(context.user.uid)
        },
    },
    User: {
        image: async (parent) => {
            return {
                uri: parent.image,
            }
        },
        guide: async (parent) => {
            return await getGuide(parent.guideID)
        },
        conversations: async (parent) => {
            let conversations = await Promise.all(
                parent.conversationIDs.map((id) => getConversation(id)),
            )
            return conversations
        },
    },
    Mutation: {
        createUser: async (parent, { input }, context, info) => {
            // Should probably check to see if the user already exists
            if (!context.user) throw new AuthenticationError()
            let { firstname, surname, image, dob } = input

            let user = User.init()
            user.id = context.user.uid
            user.firstname = firstname
            user.surname = surname
            user.image = await saveImage(image)
            user.dob = dob

            await user.save()

            return await getUser(context.user.uid)
        },
        updateUser: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            let { firstname, surname, image, dob } = input

            let user = await User.collection.get({ id: context.user.uid })
            user.firstname = firstname ? firstname : user.firstname
            user.surname = surname ? surname : user.surname
            user.dob = dob ? dob : user.dob.toDate()
            user.guide = user.guide.ref
            user.image = image ? await saveImage(image) : user.image

            await user.upsert()

            return await getUser(context.user.uid)
        },
    },
}

export default UserResolver
