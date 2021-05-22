import { Model, Field } from 'fireo'

class Review extends Model {
    guide = Field.Reference({ required: true })
    tourist = Field.Reference({ required: true })
    rating = Field.Number({ required: true })
    description = Field.Text({ required: true })
    created = Field.DateTime({ required: true })
}

export default Review
