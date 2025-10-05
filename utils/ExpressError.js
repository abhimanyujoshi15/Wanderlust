class ErrorClass extends Error{
    constructor(status,message){
        super();
        this.status = status;
        this.message = message;
    }
};
module.exports = ErrorClass;