import mongoose, { Schema } from "mongoose";

export interface IRole {
  name: string;
}

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
