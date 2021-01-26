import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, min: 6, max: 20 },
  password: { type: String, required: true, min: 6, max: 30 },
  date: { type: Date, default: Date.now },
});

interface UserDocumentType extends mongoose.Document {
  username: string;
  password: string;
  date: Date;
}

export default mongoose.model<UserDocumentType>("User", UserSchema);
