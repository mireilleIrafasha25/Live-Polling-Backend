// middleware/auth.ts

import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../errors/index";
import { AppDataSource } from "../config/database";
import { AuthenticatedRequest}  from "../types/common.types";
import { User } from "../models/userEntity";
dotenv.config();

//  Extend Express Request to include 'user'
// interface AuthenticatedRequest extends Request {
//   user?: JwtPayload | string;
// }

//  1. Authenticate Token Middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return
    }

    req.user = user; //this is a full User entity
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
    return
  }
};

//  2. Authorize Middleware
export const authorize = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || typeof req.user === "string" || (req.user as JwtPayload).role !== role) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }
    next();
  };
};

//Authenticate speciaal user