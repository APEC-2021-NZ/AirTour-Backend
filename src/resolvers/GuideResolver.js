import User from '../models/User';
import admin from 'firebase-admin';

const GuideResolver = {
    Query: {
        guide: async (parent, args, context, info) => {
            // TODO
        },
        guides: async (parent, args, context, info) => {
            // TODO
        }
    },
    Mutation: {
        createGuide: async (parent, { input }, context, info) => {
            // TODO
        },
        updateGuide: async (parent, { input }, context, info) => {
            // TODO
        }
    }
};

export default GuideResolver;
