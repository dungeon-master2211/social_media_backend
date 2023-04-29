const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    email:{
        type:String,
        required:[true,'Provide Name'],
        validate:{
            validator:function(v){
                return validator.isEmail(v)
            },
            message:'Please provide valid email'
        }
    },
    password:{
        type:String,
        required:[true,'Please Provide Password'],
        minLength:[6,'Min password length is 6']
    },
    profilePicUrl:{
        type:String,
        default:''
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetToken:String,
    passwordChangedAt:Date,

})
userSchema.pre('save',function(next){
    const user = this
    if(!user.isModified('password')) return next()
    bcrypt.hash(user.password, 10).then(function(hash) {
        // Store hash in your password DB.
        user.password = hash
        next()
    })
    
})

userSchema.methods.comparePassword = async function comparePassword(pwd,hash){
    return await bcrypt.compare(pwd,hash)
}
const userModel = mongoose.model('user',userSchema)

module.exports = userModel