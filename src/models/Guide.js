import { Model, Field } from 'fireo';

class Guide extends Model {
    id = Field.ID();
    user = Field.Reference({ required: true });
    active = Field.Boolean({ required: true });
    image = Field.Text({ required: true });
    city = Field.Reference({ required: true });
    blurb = Field.Text({ required: true });
    description = Field.Text({ required: true });
    ratingTotal = Field.Number({ required: true, default: 0 });
    rating = Field.Number({ required: true, default: 5 });
    numReviews = Field.Number({ required: true, default: 0 });
    price = Field.Text({ required: true });
    languages = Field.List({ required: true });
    experiences = Field.List({ required: true });
    destinations = Field.List({ required: true });
    tags = Field.List({ required: true });
}

class Language extends Model {
    id = Field.ID();
    name = Field.Text({ required: true });
}

class Experience extends Model {
    id = Field.ID();
    name = Field.Text({ required: true });
    image = Field.Text({ required: true });
}

class Destination extends Model {
    id = Field.ID();
    name = Field.Text({ required: true });
    image = Field.Text({ required: true });
    city = Field.Reference({ required: true });
}

class Tag extends Model {
    id = Field.ID();
    name = Field.Text({ required: true });
    image = Field.Text({ required: true });
}

export { Language, Experience, Destination, Tag };
export default Guide;
