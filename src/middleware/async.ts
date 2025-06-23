import { Request,Response,NextFunction ,RequestHandler} from "express"

type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;
const asyncWrapper = (fn: AsyncMiddleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncWrapper;