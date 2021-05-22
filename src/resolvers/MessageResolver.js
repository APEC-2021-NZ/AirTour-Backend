import { getUser } from './UserResolver';

const MessageResolver = {
    Message: {
        from: async (parent) => {
            return await getUser(parent.fromID);
        },
        booking: async (parent) => {
            return parent.bookingID ? await getBooking(parent.bookingID) : null;
        }
    },
    Mutation: {
        message: async (parent, { input }, context, info) => {
            // TODO
        }
    }
};

export default MessageResolver;
