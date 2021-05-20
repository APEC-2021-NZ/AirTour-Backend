import { Model, Field } from 'fireo';

class User extends Model {
    id = Field.ID();
    firstname = Field.Text({ required: true });
    surname = Field.Text({ required: true });
    image = Field.Text({ required: true });
    dob = Field.DateTime({ required: true });
    guide = Field.Reference();
}

export default User;