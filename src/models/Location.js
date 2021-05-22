import { Model, Field } from 'fireo'

class City extends Model {
    id = Field.ID()
    name = Field.Text({ required: true })
    country = Field.Reference({ required: true })
}

class Country extends Model {
    id = Field.ID()
    name = Field.Text({ required: true })
}

export { City, Country }
