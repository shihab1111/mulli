// import { Schema, model } from "mongoose";

// const notificationSchema = new Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },
//     type: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     title: { type: String, required: true },
//     body: { type: String, required: true },
//     data: { type: Schema.Types.Mixed },
//     isRead: { type: Boolean, default: false, index: true },
//   },
//   { timestamps: true },
// );

// notificationSchema.index({ user: 1, createdAt: -1 });

//  const Notification = model("Notification",notificationSchema,);
// export default Notification;