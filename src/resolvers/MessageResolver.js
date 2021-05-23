import { AuthenticationError } from 'apollo-server-errors'
import { sendMessage } from '../lib/messaging'
import { getBooking } from './BookingResolver'
import { getUser } from './UserResolver'

const MessageResolver = {
    Message: {
        from: async (parent) => {
            return await getUser(parent.fromID)
        },
        booking: async (parent) => {
            return parent.bookingID ? await getBooking(parent.bookingID) : null
        },
    },
    Mutation: {
        message: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            let { conversationID, content } = input

            let message = await sendMessage({
                userID: context.user.uid,
                conversationID,
                content,
            })

            return message
        },
    },
}

export default MessageResolver
