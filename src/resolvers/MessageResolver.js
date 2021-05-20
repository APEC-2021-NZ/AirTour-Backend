import User from '../models/User';
import admin from 'firebase-admin';

const MessageResolver = {
    Mutation: {
        message: async (parent, { input }, context, info) => {
            // TODO
        }
    }
};

export default MessageResolver;
