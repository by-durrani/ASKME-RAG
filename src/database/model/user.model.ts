import { model, models, Schema } from "mongoose";

const user = new Schema(
  {
    clerkId: { type: String, required: true, index: true, unique: true },
    fName: { type: String, required: true },
    lName: { type: String, default: "" },
    providerUserName: { type: String },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    provider: {
      type: String,
      enum: ["email", "google", "github"],
      required: true,
    },
    userMapId: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = models.User || model("User", user);

export default User;
