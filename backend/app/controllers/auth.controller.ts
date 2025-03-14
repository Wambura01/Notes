import authConfig from "../config/auth.config";
import db from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

interface Role {
  name: string;
  _id: string;
}

const User = db.User;
const Role = db.Role;

export const signUp = async (req: Request, res: Response) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const role = await Role.findOne({ name: "user" });
    if (!role) {
      throw new Error("Default user role not found");
    }
    user.roles = [role._id];

    await user.save();
    res.status(201).json({ message: "User was registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate(
      "roles",
      "-_v"
    );

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // validate password
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // generate JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      algorithm: "HS256",
      expiresIn: 86400,
    });

    const authorities = (user.roles as unknown as Role[]).map(
      (role: Role) => `ROLE_${role.name.toUpperCase()}`
    );

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
