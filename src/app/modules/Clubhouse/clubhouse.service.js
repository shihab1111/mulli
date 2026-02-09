import Post from "./clubhouse.model.js";


 export const createPostService = async (data, userId) => {
  // make sure author in payload is ignored
  delete data.author;

  return await Post.create({
    ...data,
    author: userId, // MUST be ObjectId
  });
};
const getHomeFeedService = async () => {
  return await Post.find({ visibility: "public" })
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });
};

export const likePostService = async (user, postId) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: user.id } },
    { new: true }
  );

  return {
    totalLikes: post.likes.length,
    postId: post._id
  };
};

export const commentPostService = async (user, postId, text) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  // Add new comment
  post.comments.push({
    user: user.id,
    text,
  });

  // Update total comments
  post.commentsCount = post.comments.length;

  await post.save();

  return {
    postId: post._id,
    totalComments: post.commentsCount,
    latestComment: post.comments[post.comments.length - 1],
  };
};

const sendGiftService = async (postId, userId, giftType) => {
  return await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        gifts: { user: userId, giftType, sentAt: new Date() },
      },
    },
    { new: true }
  );
};

export const postServices={
createPostService,
getHomeFeedService,
likePostService ,
sendGiftService,
commentPostService

}