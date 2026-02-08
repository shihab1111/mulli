// /* eslint-disable no-unused-vars */

// import { StatusCodes } from "http-status-codes";

// import { catchAsync } from "../../utils/catchAsync.js";
// import { sendResponse } from "../../utils/sendResponse.js";
// import { NotificationService } from "./notification.service.js";

// const myNotifications = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const result = await NotificationService.getMyNotifications(
//     userId,
//     req.query,
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Notifications fetched",
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const markRead = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const { notificationId } = req.params;

//   await NotificationService.markAsRead(userId, notificationId);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Notification marked as read",
//     data: null,
//   });
// });

// const markAllRead = catchAsync(async (req, res) => {
//   const { userId } = req.user;

//   const result = await NotificationService.markAllRead(userId);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "All notifications marked as read",
//     data: result,
//   });
// });

// const deleteNotificationController = catchAsync(
//   async (req, res) => {
//     const { notificationId } = req.params;

//     await NotificationService.deleteNotification(notificationId);

//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message: "Notification deleted successfully",
//       data: null,
//     });
//   },
// );

// export const NotificationController = {
//   myNotifications,
//   markRead,
//   markAllRead,
//   deleteNotificationController,
// };
