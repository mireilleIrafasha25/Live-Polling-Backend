export class AppError extends Error{
    public statusCode:number;
    public isOperatinal:boolean

    constructor (message:string,statusCode:number,isOperational:true)
    {
        super(message);
        this.statusCode=statusCode;
        this.isOperatinal=isOperational;
         Error.captureStackTrace(this,this.constructor)
    }
}

 export class ValidationError extends AppError {
    public errors: Record<string, string[]>;
  
    constructor(errors: Record<string, string[]>, message = 'Validation failed') {
      super(message, 400,true);
      this.errors = errors;
    }
  }