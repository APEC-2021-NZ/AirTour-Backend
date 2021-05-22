import { Model, Field } from 'fireo'
import { required } from 'yargs'

class User extends Model {
    id = Field.ID()
    firstname = Field.Text({ required: true })
    surname = Field.Text({ required: true })
    image = Field.Text({ required: true })
    dob = Field.DateTime({ required: true })
    guide = Field.Reference()
    conversations = Field.List({ required: true, default: [] })
    wishlist = Field.List({ required: true, default: [] })
}

export default User
