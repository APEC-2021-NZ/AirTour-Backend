import User from '../models/User';
import admin from 'firebase-admin';

const ConversationResolver = {
    Query: {
        conversation: async (parent, { conversationID }, context, info) => {
            // TODO
        }
    },
    Mutation: {
        createConversation: async (parent, { input }, context, info) => {
            // TODO
        }
    }
};

export default ConversationResolver;
