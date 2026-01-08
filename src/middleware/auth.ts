import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          message: "Authorization header missing",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "Please provide valid token",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      console.log(decoded)

      if (!decoded) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      // attach user to request
      req.user = decoded;

      // 🔐 Role-based access control
      if (roles && roles.length > 0) {
        const userRole = decoded.role;

        if (!roles.includes(userRole)) {
          return res.status(403).json({
            message: "Forbidden: insufficient permission",
          });
        }
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};
