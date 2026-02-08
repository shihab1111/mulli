import Match from "./match.model.js";

// controllers/swipeController.js

// Get all matches
export const getMatches = async (req, res) => {
  try {
    const userId = "69877082162a52e4a1c7bc03";

    const matches = await Match.find({
      users: userId,
    })
      .populate("users", "name profileImage age location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      matches,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};