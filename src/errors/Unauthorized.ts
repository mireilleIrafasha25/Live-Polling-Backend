import CustomError from "./customError.js";
export class UnauthorizedError extends CustomError {
      statusCode: number;
    constructor(message:string) {
        super(message);
        this.statusCode = 401;
    }
}