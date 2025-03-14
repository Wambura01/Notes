import jwt from "jsonwebtoken";
import db from "../models";
import { Request, Response, NextFunction } from "express";
import authConfig from "../config/auth.config";
import { IUser } from "../models/user.model";

interface CustomRequest extends Request {
  userId?: string;
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

const User = db.User;
const Role = db.Role;

const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  // If token is an array, get the first element
  if (Array.isArray(token)) {
    token = token[0];
  }

  // Remove 'Bearer ' prefix if present
  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, authConfig.secret) as JwtPayload;
    req.userId = decoded.id;

    // Fetch user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user as any;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

const isAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const roles = await Role.find({
      _id: { $in: user?.roles },
    });

    const hasAdminRole = roles.some((role) => role.name === "admin");

    if (!hasAdminRole) {
      return res.status(403).json({ message: "Require Admin Role!" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

const isModerator = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const roles = await Role.find({ _id: { $in: user?.roles } });

    const hasModeratorRole = roles.some((role) => role.name === "moderator");

    if (!hasModeratorRole) {
      return res.status(403).json({ message: "Require Moderator Role!" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};

export default authJwt;
