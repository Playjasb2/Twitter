import mongoose, { Schema } from "mongoose";

const MessageSchema: Schema = new Schema({
  from: { type: String, required: true, min: 6, max: 20 },
  to: { type: String, required: true, min: 6, max: 20 },
  message: { type: String, required: true, min: 10, max: 280 },
  date: { type: Date, default: Date.now },
});

interface MessageDocumentType extends mongoose.Document {
  from: string;
  to: string;
  message: string;
  date: Date;
}

export default mongoose.model<MessageDocumentType>("Message", MessageSchema);
