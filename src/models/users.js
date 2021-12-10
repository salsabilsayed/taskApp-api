const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // password hash
const jwt = require('jsonwebtoken')  // token


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,

    },
    age:{
        type:Number,
       default:20,
       validate(value){
        if(value <= 0){
            throw new Error('age must be > 0')
        }
    }
    },
    tokens:[
        {
        token:{
            type:String,
            required:true
        }
    }
    ],
    avatar:{
        type:Buffer,
        default:null
    }
})


userSchema.virtual('tasks',{
    ref:'tasks',  // model name
    localField:'_id',
    foreignField:'owner'
})

// to hash password before saving user(middleware)

userSchema.pre('save',async function(next){
    const user = this
    //console.log(user);
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
})

// find user email & check password for login

userSchema.statics.findCredentials = async(email,password)=>{
    const user = await User.findOne({email:email});
    if(!user){
        throw new Error("please sign up")
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("unable to login");
    }
    return user;
}

// genetate user token (sign up && login)

userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

// hide data 
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject;
}

const User = mongoose.model('users',userSchema);

module.exports = User;