import mongoose from "mongoose";

import User from "./user.model";
import Role from "./role.model";
import Notes from "./notes.model";

interface DB {
  mongoose: typeof mongoose;
  User: typeof User;
  Role: typeof Role;
  ROLES: string[];
  Notes: typeof Notes;
}

const db: DB = {
  mongoose,
  User,
  Role,
  ROLES: ["user", "admin", "moderator"],
  Notes,
};

export default db;
