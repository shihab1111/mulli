import Match from "../Liked/match.model.js";
import Swipe from "./swipe.model.js";

// Like a user
export const likeUser = async (req, res) => {
  try {
    const fromUserId = "698766aeb4a9609dd15df121";
    const { toUserId } = req.body;

    // Create the like
    await Swipe.create({
      fromUser: fromUserId,
      toUser: toUserId,
      action: "like",
    });

    // Check if other user also liked you
    const reciprocalLike = await Swipe.findOne({
      fromUser: toUserId,
      toUser: fromUserId,
      action: "like",
    });

    // If both liked each other, create a match
    if (reciprocalLike) {
      const match = await Match.create({
        users: [fromUserId, toUserId].sort(),
      });

      return res.json({
        success: true,
        isMatch: true,
        match,
      });
    }

    res.json({
      success: true,
      isMatch: false,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Pass a user
export const passUser = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.body;

    await Swipe.create({
      fromUser: fromUserId,
      toUser: toUserId,
      action: "pass",
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// controllers/swipeController.js

// Get all your likes
export const getMyLikes = async (req, res) => {
  try {
    const userId = req.user.id;

    const likes = await Swipe.find({
      fromUser: userId,
      action: "like",
    })
      .populate("toUser", "name profileImage age location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      likes,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all your passes
export const getMyPasses = async (req, res) => {
  try {
    const userId = req.user.id;

    const passes = await Swipe.find({
      fromUser: userId,
      action: "pass",
    })
      .populate("toUser", "name profileImage age location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      passes,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};