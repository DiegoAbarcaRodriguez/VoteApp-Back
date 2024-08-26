import mongoose from "mongoose";

const voteOptionSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, 'Mising title']
    },
    img: {
        type: String,
        require: [true, 'Missing image']
    },
    description: {
        type: String,
        require: [true, 'Mising description']
    },
    amount: {
        type: Number,
        default: 0
    }
});

voteOptionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function transform(doc, ret, options) {
        delete ret._id;
    }
});




export const VoteOptionModel = mongoose.model('optionVote', voteOptionSchema);