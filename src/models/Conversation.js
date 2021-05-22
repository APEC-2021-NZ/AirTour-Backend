import { Model, Field } from 'fireo';

class Conversation extends Model {
    user = Field.Reference({ required: true });
    guide = Field.Reference({ required: true });
    created = Field.DateTime({ required: true });
    // messages is a sub collection
}

class Message extends Model {
    from = Field.Reference({ required: true });
    content = Field.Text({ required: true });
    booking = Field.Reference();
    created = Field.DateTime({ required: true });
}

export { Conversation, Message };
