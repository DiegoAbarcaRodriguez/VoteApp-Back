import mongoose, { model } from "mongoose";


const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    }

});


participantSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function transform(doc, ret, options) {
        delete ret._id;
    }
});


export const participantModel = model('participant', participantSchema);