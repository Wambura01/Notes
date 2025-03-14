import mongoose from "mongoose";

import User from "./user.model";
import Role from "./role.model";

interface DB {
  mongoose: typeof mongoose;
  User: typeof User;
  Role: typeof Role;
  ROLES: string[];
}

const db: DB = {
  mongoose,
  User,
  Role,
  ROLES: ["user", "admin", "moderator"],
};

export default db;
