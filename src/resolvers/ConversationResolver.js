import { AuthenticationError, ForbiddenError } from 'apollo-server-errors';
import dateFormat from 'dateformat';
import { Fireo } from 'fireo';
import { ConversationExistsError } from '../errors/ConversationError';
import { Conversation, Message } from '../models/Conversation';
import Guide from '../models/Guide';
import User from '../models/User';
import { getBooking } from './BookingResolver';
import { getGuide } from './GuideResolver';
import { getUser } from './UserResolver';

export const getConversation = async (id) => {
    let conversation = await Conversation.collection.get({ id });
    return {
        key: conversation.key,
        id: conversation.id,
        userID: conversation.user.ref.id,
        guideID: conversation.guide.ref.id,
        created: conversation.created
    };
};

export const getMessages = async (conversationKey, offset, limit) => {
    let messages = await Message.collection
        .parent(conversationKey)
        .orderBy('-created')
        .fetch(offset + limit);
    return messages.list.slice(offset).map((msg) => ({
        id: msg.id,
        fromID: msg.from.ref.id,
        content: msg.content,
        bookingID: msg.booking && msg.booking.ref ? msg.booking.ref.id : null,
        created: msg.created
    }));
};

const generateBookingMessage = (startDate, endDate, numTourists, content) => {
    return `[Booking Request] From ${dateFormat(startDate)} to ${dateFormat(endDate)} for ${numTourists} ${
        numTourists > 1 ? 'people' : 'person'
    }.`;
};

const ConversationResolver = {
    Query: {
        conversation: async (parent, { conversationID }, context, info) => {
            if (!context.user) throw AuthenticationError();
            let conversation = await getConversation(conversationID);

            if (![conversation.userID, conversation.guideID].includes(context.user.uid)) throw new ForbiddenError();

            return getConversation(conversationID);
        }
    },
    Conversation: {
        user: async (parent) => {
            return await getUser(parent.userID);
        },
        guide: async (parent) => {
            return await getGuide(parent.guideID);
        },
        messages: async (parent, { offset, limit }) => {
            return await getMessages(parent.key, offset, limit);
        }
    },
    Mutation: {
        createConversation: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError();

            let { guideID, startDate, endDate, numTourists, content } = input;

            let conversationId = await Fireo.runTransaction(async (transaction) => {
                let user = await User.collection.get({ id: context.user.uid, transaction });
                let guide = await Guide.collection.get({ id: guideID, transaction });

                // Check if a conversation already exists between these users
                let existingConversation = await Conversation.collection
                    .where('user', '==', user.key)
                    .where('guide', '==', guide.key)
                    .get({ transaction });

                if (existingConversation) throw new ConversationExistsError();

                let conversation = Conversation.init();
                conversation.user = user.key;
                conversation.guide = guide.key;
                conversation.created = new Date();

                await conversation.save({ transaction });

                let systemMessage = Message.init({ parent: conversation.key });
                systemMessage.from = user.key;
                systemMessage.content = generateBookingMessage(startDate, endDate, numTourists, content);
                systemMessage.created = new Date(Date.now() - 1000);

                await systemMessage.save({ transaction });

                let message = Message.init({ parent: conversation.key });
                message.from = user.key;
                message.content = content;
                message.created = new Date();

                await message.save({ transaction });

                if (!user.conversations) {
                    user.conversations = [conversation.id];
                } else if (!user.conversations.includes(guide.id)) {
                    user.conversations = [...user.conversations, conversation.id];
                }

                user.dob = user.dob.toDate();
                user.guide = user.guide.red;

                await user.upsert({ transaction });

                return conversation.id;
            });

            return await getConversation(conversationId);
        }
    }
};

export default ConversationResolver;
