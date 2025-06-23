class UnauthorizedError extends Error {
    statusCode:number;
    constructor(message:string) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}

class ForbiddenError extends Error {
    statusCode:number;
    constructor(message:string) {
        super(message);
        this.name = "ForbiddenError";
        this.statusCode = 403;
    }
}

export { UnauthorizedError, ForbiddenError };
