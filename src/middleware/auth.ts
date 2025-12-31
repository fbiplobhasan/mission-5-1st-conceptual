import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/enums";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (role?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) res.send({ message: "Please provide valid token." });

    try {
      const decoded = jwt.verify(token as string, "verify secret");
      console.log(decoded);
      if (!decoded) return res.send("Unauthorized access.");

      req.user = decoded as JwtPayload;

      next();
    } catch (error) {
      console.error(error);
    }
  };
};

export default auth;
