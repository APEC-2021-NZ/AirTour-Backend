import { Model, Field } from 'fireo';

class Booking extends Model {
    tourist = Field.Reference({ required: true });
    guide = Field.Reference({ required: true });
    startTime = Field.DateTime({ required: true });
    endTime = Field.DateTime({ required: true });
    description = Field.Text({ required: true });
    confirmedTourist = Field.Boolean({ required: true });
    confirmedGuide = Field.Boolean({ required: true });
    price = Field.Text({ required: true });
    created = Field.DateTime({ required: true });
}

export default Booking;
