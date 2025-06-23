import CustomError from "./customError";
export class NotFoundError extends CustomError {
      statusCode: number;
    constructor(message:string) {
        super(message);
        this.statusCode = 404;
    }
}