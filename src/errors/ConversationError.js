import { ApolloError } from 'apollo-server-errors';

class ConversationError extends ApolloError {
    constructor(message = 'Conversation error.', code = 'CONVERSATION_ERROR') {
        super(message, code);
    }
}

class ConversationExistsError extends ConversationError {
    constructor() {
        super(
            'There is already an existing conversation between you and the specified user.',
            'CONVERSATION_EXISTS_ERROR'
        );
    }
}

export { ConversationExistsError };
export default ConversationError;
