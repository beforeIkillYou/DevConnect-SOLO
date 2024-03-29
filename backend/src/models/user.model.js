import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        index : true,
    },

    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },

    fullname : {
        type : String,
        required : true,
        trim : true,
    },

    avatar : {
        type : String, //cloudinary url
        required : true,
    },

    password : {
        type : String,
        required : [true, "Password is required"],
    },

    bio:{
        type : String,
        required : [true, "Bio is required"],
    },

    story:{
        type : String, //cloudinary url
        default : undefined,
    },

    posts : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Post',
        }
    ],

    comments: [ //on the fronetnd we can show it in the notificaiton part
        {
            type : Schema.Types.ObjectId,
            ref : 'Comment',
        }
    ],

    likedPosts : [ 
        {
            type : Schema.Types.ObjectId,
            ref : 'Post',
        }
    ],

    followers :[
        {
            type : Schema.Types.ObjectId,
            ref : 'User',
        }
    ],

    following :[
        {
            type : Schema.Types.ObjectId,
            ref : 'User',
        }
    ],

    refreshToken: {
        type : String,
    }
},{timestamps:true});

//hasihing the password before saving in the db
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id : this._id,
            emal: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model('User',userSchema);