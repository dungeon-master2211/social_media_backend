exports.errorMiddleware = async(err,req,res,next)=>{
    if(err){
        console.error(err)
        const status = err.status||500
        const msg = err.message || 'Internal Server Error'
        if(msg==='jwt expired'){
            return res.status(404).json({
                isAuthenticated:false,
                status:'fail',
                message:'Please login to continue!'
            })
        }
        return res.status(status).send({
            status:'fail',
            message:msg,
            error:err,
        })
    }
    next()
}