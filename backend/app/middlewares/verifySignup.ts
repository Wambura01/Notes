import { Request, Response, NextFunction } from "express";
import db from "../models";

const ROLES = db.ROLES;
const User = db.User;

const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if username exists
    const userByUsername = await User.findOne({ username: req.body.username });
    if (userByUsername) {
      return res
        .status(400)
        .json({ message: "Failed! Username is already in use!" });
    }

    // Check if email exists
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      return res
        .status(400)
        .json({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    next(err);
    res.status(500).json({ message: (err as Error).message });
  }
};

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.roles) {
    const invalidRoles = req.body.roles.filter(
      (role: string) => !ROLES.includes(role)
    );
    if (invalidRoles.length > 0) {
      return res.status(400).json({
        message: `Failed! Roles [${invalidRoles.join(", ")}] do not exist!`,
      });
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

export default verifySignUp;
