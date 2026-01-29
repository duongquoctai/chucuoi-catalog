import mongoose, { Model, models, Schema } from "mongoose";

export interface IUser {
  _id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index for performance
UserSchema.index({ email: 1, role: 1 });

const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
