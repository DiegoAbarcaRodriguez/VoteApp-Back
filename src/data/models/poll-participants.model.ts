import mongoose, { model } from "mongoose";

const pollParticipantSchema = new mongoose.Schema({
    participant_id: {
        type: mongoose.Types.ObjectId,
        ref: 'participant',
        required: [true, 'The participant_id is required']
    },
    poll_id: {
        type: mongoose.Types.ObjectId,
        ref: 'poll',
        required: [true, 'The poll_id is required']
    },

});


pollParticipantSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function transform(doc, ret, options) {
        delete ret._id;
    }
});


export const pollParticipantModel = model('poll-participant', pollParticipantSchema);