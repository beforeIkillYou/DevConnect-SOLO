import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    likes:{
        type: Number,
        default: 0
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

export const Comment = mongoose.model('Comment',commentSchema);