const { Model, Field } = require('fireo')

class Image extends Model {
    uri = Field.Text()
}

export default Image
