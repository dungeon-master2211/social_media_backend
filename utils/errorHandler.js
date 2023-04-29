class ErrorHandler extends Error{
    constructor(message,status){
        super(message)
        this.message = message || 'Internal Server Error'
        this.status = status || 500
    }
}

module.exports = ErrorHandler