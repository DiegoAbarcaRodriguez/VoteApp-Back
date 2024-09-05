import mongoose, { model } from "mongoose";


const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    numberOfParticipants: {
        type: Number,
        default: 0
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, 'The user_id is required']
    }
});


pollSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function transform(doc, ret, options) {
        delete ret._id;
    }
});


export const pollModel = model('poll', pollSchema);