const jwt = require('jsonwebtoken')

exports.generateToken = async(id)=>{
    const secret = process.env.JWT_SECRET
    const token = await jwt.sign({id:id},secret,{
        expiresIn:'128h'
    })
    const data = await token
    return data
}