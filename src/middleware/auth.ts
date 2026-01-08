import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/enums";
import { auth as betterAuth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = (resource: "user" | "equipment", action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers,
      });

      if (!session)
        return res.status(401).send({
          message: "Unauthorized.",
        });

      const hasPermission = await betterAuth.api.userHasPermission({
        body: {
          userId: session?.user.id,
          role: session?.user.role || ("user" as any),
          permission: { [resource]: [action] },
        },
      });

      if (!hasPermission || !hasPermission.success) {
        return res.status(401).send({
          message: `Forbidden You do not have permission to ${action} ${resource}`,
        });
      }

      next();
    } catch (error) {
      console.log(error);
    }
  };
};
