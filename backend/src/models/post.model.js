import mongoose,{Schema} from "mongoose";

const postSchema = new Schema(
    {
        media : {
            type: String, //cloudinary uri
            required: true
        },
        title : {
            type: String,
            required: true
        },
        description : {
            type: String,
            required: true
        },
        views:{
            type: Number,
            default: 0
        },
        likes:{
            type: Number,
            default: 0
        },

        owner:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        comments:[
            {
                type: Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
    },{timestamps:true}
);

export const Post = mongoose.model("Post", postSchema);