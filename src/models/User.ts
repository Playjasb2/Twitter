import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true, min: 6, max: 20 },
  password: { type: String, required: true, min: 6, max: 30 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
