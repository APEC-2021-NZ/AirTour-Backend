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
            if (!context.user) return;
        },
        updateGuide: async (parent, { input }, context, info) => {
            // TODO
        }
    }
};

export default GuideResolver;
