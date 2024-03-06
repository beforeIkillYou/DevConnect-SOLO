import mongoose,{Schema} from 'mongoose';

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
        default : 'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png' //default user image link
    },

    password : {
        type : String,
        required : [true, "Password is required"],
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