
import CustomError from "./customError";

export class BadRequestError extends CustomError {
    statusCode:number;
    constructor(message:string) {
        super(message);
        this.statusCode=400;
    }
}