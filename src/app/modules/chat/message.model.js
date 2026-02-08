import { Schema, model, Types } from "mongoose";

// Message Status enumeration
export const MessageStatus = {
  SENT: "SENT",
  DELIVERED: "DELIVERED",
  SEEN: "SEEN",
};

const subSchema = new Schema(
  {
    text: { type: String },
    image: { type: String },
  },
  {
    versionKey: false,
    timestamps: false,
    _id: false,
  },
);

const messageSchema = new Schema(
  {
    receiver: { type: Types.ObjectId, ref: "User", required: true },
    sender: { type: Types.ObjectId, ref: "User", required: true },
    message: subSchema,
    status: { type: String, enum: [...Object.keys(MessageStatus)] },
    replyTo: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

 const Message = model("Message", messageSchema);
export default Message;