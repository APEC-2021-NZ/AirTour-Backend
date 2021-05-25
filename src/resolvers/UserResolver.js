import { AuthenticationError } from 'apollo-server-errors'
import admin from 'firebase-admin'
import { Fireo } from 'fireo'
import moment from 'moment'
import {
    EmailTakenError,
    InvalidEmailError,
    InsecurePasswordError,
    InvalidFirstNameError,
    InvalidSurnameError,
    UnderageError,
} from '../errors/UserError'
import { saveImage } from '../lib/storage'
import User from '../models/User'
import { getConversation } from './ConversationResolver'
import { getGuide } from './GuideResolver'

export const getUser = async (id) => {
    let user = await User.collection.get({ id })
    return {
        key: user.key,
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
            return parent.guideID ? await getGuide(parent.guideID) : null
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
            let { email, password, firstname, surname, image, dob } = input

            if (!firstname) {
                throw new InvalidFirstNameError()
            }

            if (!surname) {
                throw new InvalidSurnameError()
            }

            const eighteenYearsAgo = moment().subtract(18, 'years').toDate()

            if (new Date(dob) > eighteenYearsAgo) {
                throw new UnderageError()
            }

            let userRecord = null

            try {
                userRecord = await admin.auth().createUser({
                    email,
                    password,
                })
            } catch (e) {
                switch (e.code) {
                    case 'auth/email-already-exists':
                        throw new EmailTakenError()
                    case 'auth/invalid-email':
                        throw new InvalidEmailError()
                    case 'auth/invalid-password':
                        throw new InsecurePasswordError()
                }
                throw e
            }

            let user = User.init()
            user.id = userRecord.uid
            user.firstname = firstname
            user.surname = surname
            user.image = image
                ? await saveImage(image)
                : 'https://www.gravatar.com/avatar?d=mp'
            user.dob = dob
            user.wishlist = []
            user.conversations = []

            await user.save()

            return await getUser(userRecord.uid)
        },
        updateUser: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            let { firstname, surname, image, dob } = input

            await Fireo.runTransaction(async (transaction) => {
                let user = await User.collection.get({
                    id: context.user.uid,
                    transaction,
                })
                user.firstname = firstname ? firstname : user.firstname
                user.surname = surname ? surname : user.surname
                user.dob = dob ? dob : user.dob.toDate()
                user.guide = user.guide.ref
                user.image = image ? await saveImage(image) : user.image

                await user.upsert({ transaction })
            })

            return await getUser(context.user.uid)
        },
    },
}

export default UserResolver
