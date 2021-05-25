import { ForbiddenError } from 'apollo-server-errors'
import Booking from '../models/Booking'
import { Conversation, Message } from '../models/Conversation'
import User from '../models/User'

const sendMessage = async ({
    userID,
    conversationID,
    content,
    bookingID = null,
}) => {
    const user = await User.collection.get({ id: userID })
    const conversation = await Conversation.collection.get({
        id: conversationID,
    })

    if (
        userID !== conversation.user.ref.id &&
        userID !== conversation.guide.ref.id
    ) {
        throw new ForbiddenError()
    }

    const booking = bookingID
        ? await Booking.collection.get({ id: bookingID })
        : null

    let message = Message.init({ parent: conversation.key })
    message.from = user.key
    message.content = content
    message.created = new Date()

    if (booking) {
        message.booking = booking.key
    }

    await message.save()

    return {
        id: message.id,
        fromID: user.id,
        content: message.content,
        bookingID: booking ? booking.id : null,
        created: message.created,
    }
}

export { sendMessage }
