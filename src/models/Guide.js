import { Model, Field } from 'fireo';

class Guide extends Model {
    user = Field.Reference({ required: true });
    active = Field.Boolean({ required: true });
    image = Field.Reference({ required: true });
    city = Field.Reference({ required: true });
    blurb = Field.Text({ required: true });
    description = Field.Text({ required: true });
    rating = Field.Float({ required: true });
    numReviews = Field.Int({ required: true });
    price = Field.Text({ required: true });
    languages = Field.Array({ required: true });
    experiences = Field.Array({ required: true });
    destinations = Field.Array({ required: true });
    tags = Field.Array({ required: true });
}

class Language extends Model {
    name = Field.Text({ required: true });
}

class Experience extends Model {
    name = Field.Text({ required: true });
    image = Field.Text({ required: true });
}

class Destination extends Model {
    name = Field.Text({ required: true });
    image = Field.Text({ required: true });
    city = Field.Reference({ required: true });
}

class Tag extends Model {
    name = Field.Text({ required: true });
    image = Field.Text({ required: true });
}

export { Language, Experience, Destination, Tag };
export default Guide;
