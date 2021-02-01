import Message from "../models/Message";
import User from "../models/User";
import { MessageType, AllMessagesOrder } from "../servers/ChatServer";

export const saveMessage = async (msg: MessageType) => {
  const fromUser = await User.findOne({ username: msg.from });

  if (!fromUser) {
    throw Error("First user doesn't exist");
  }

  const toUser = await User.findOne({ username: msg.to });

  if (!toUser) {
    throw Error("Second user doesn't exist");
  }

  const message = new Message({
    from: msg.from,
    to: msg.to,
    message: msg.message,
  });

  await message.save();
};

export const getAllMessages = async (order: AllMessagesOrder) => {
  const fromUser = await User.findOne({ username: order.from });

  if (!fromUser) {
    throw Error("First user doesn't exist");
  }

  const toUser = await User.findOne({ username: order.to });

  if (!toUser) {
    throw Error("Second user doesn't exist");
  }

  const messages = Message.find({
    $or: [
      { from: order.from, to: order.to },
      { from: order.to, to: order.from },
    ],
  })
    .sort({ date: -1 })
    .limit(100);

  return messages;
};
