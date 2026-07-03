import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

/**
 * Middleware role authorization.
 * Gunakan setelah authMiddleware.
 * Contoh: allowRoles("admin", "operator")
 */
export const allowRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "User belum login" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke fitur ini",
      });
    }

    next();
  };
};
