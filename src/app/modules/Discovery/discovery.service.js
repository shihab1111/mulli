import mongoose from "mongoose";
import User from "../User/user.model.js";
import Swipe from "../Swipe/swipe.model.js";
import AppError from "../../errorHelpers/AppError.js";

const COOLDOWN_HOURS = 24;



const birthdateRangeFromAge = (minAge, maxAge) => {
  const today = new Date();

  const maxBirthdate = new Date(today);
  maxBirthdate.setFullYear(today.getFullYear() - minAge);

  const minBirthdate = new Date(today);
  minBirthdate.setFullYear(today.getFullYear() - maxAge);

  return { $gte: minBirthdate, $lte: maxBirthdate };
};



const sanitizeFilters = (filters = {}) => {
  const cleaned = {};

  if (filters.minAge !== undefined) cleaned.minAge = Number(filters.minAge);
  if (filters.maxAge !== undefined) cleaned.maxAge = Number(filters.maxAge);
  if (filters.distance !== undefined) cleaned.distance = Number(filters.distance);

  if (filters.skillLevels !== undefined) {
    cleaned.skillLevels = Array.isArray(filters.skillLevels) ? filters.skillLevels : [];
  }

  if (cleaned.minAge !== undefined && (cleaned.minAge < 18 || cleaned.minAge > 100)) {
    throw new AppError(400, "minAge must be between 18 and 100");
  }
  if (cleaned.maxAge !== undefined && (cleaned.maxAge < 18 || cleaned.maxAge > 100)) {
    throw new AppError(400, "maxAge must be between 18 and 100");
  }
  if (cleaned.minAge !== undefined && cleaned.maxAge !== undefined && cleaned.minAge > cleaned.maxAge) {
    throw new AppError(400, "minAge cannot be greater than maxAge");
  }

  return cleaned;
};

const buildBaseQuery = async (userId) => {
  const cutoff = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000);

  const recentSwipes = await Swipe.find({
    fromUser: userId,
    createdAt: { $gte: cutoff },
  }).select("toUser");

  const swipedIds = recentSwipes.map((s) => s.toUser);

  const dbQuery = {
    _id: { $ne: userId, $nin: swipedIds },
    isProfileComplete: true,
  };

  return { dbQuery, cutoff };
};

const applyGenderPreference = (dbQuery, me) => {
  if (me.genderPreference && me.genderPreference !== "Everyone") {
    dbQuery.gender = me.genderPreference;
  }
};


const applyFiltersToQuery = (dbQuery, me, filters) => {

  const minAge = filters.minAge ?? 18;
  const maxAge = filters.maxAge ?? 60;
  dbQuery.birthdate = birthdateRangeFromAge(minAge, maxAge);

  
  if (Array.isArray(filters.skillLevels) && filters.skillLevels.length > 0) {
    dbQuery.skillLevel = { $in: filters.skillLevels };
  }

 
  if (typeof filters.distance === "number" && filters.distance > 0 && me.location) {
    dbQuery.location = me.location;
  }

  return {
    minAge,
    maxAge,
    distance: filters.distance ?? null,
    skillLevels: filters.skillLevels ?? [],
  };
};



const fetchUsersByCursor = async (dbQuery, cursor, limit) => {
  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    dbQuery._id.$lt = new mongoose.Types.ObjectId(cursor);
  }

  const users = await User.find(dbQuery)
    .select("name birthdate gender location skillLevel playStyle profileImage images")
    .sort({ _id: -1 })
    .limit(limit);

  const nextCursor = users.length ? String(users[users.length - 1]._id) : null;

  return { users, nextCursor };
};



const getDiscoveryBatchService = async (authUser, query) => {
  const userId ="69881c8f04c3ff643148c27c" ;
  if (!userId) throw new AppError(401, "Unauthorized");

  const limit = Math.min(Math.max(parseInt(query.limit || "20", 10), 1), 50);
  const cursor = query.cursor;
  const filtered = query.filtered === "true";

  const me = await User.findById(userId).select("genderPreference filters location isProfileComplete");
  if (!me) throw new AppError(404, "User not found");

  const { dbQuery, cutoff } = await buildBaseQuery(userId);

  // Always apply gender preference
  applyGenderPreference(dbQuery, me);

  // Apply SAVED filters only if requested
  let appliedFilters = null;
  if (filtered) {
    const safe = sanitizeFilters(me.filters || {});
    appliedFilters = applyFiltersToQuery(dbQuery, me, safe);
  }

  const { users, nextCursor } = await fetchUsersByCursor(dbQuery, cursor, limit);

  return {
    mode: filtered ? "saved_filters" : "gender_only",
    cooldownHours: COOLDOWN_HOURS,
    cooldownCutoff: cutoff,
    limit,
    cursor: cursor || null,
    nextCursor,
    hasMore: !!nextCursor,
    users,
    appliedFilters,
  };
};

// ---------------------------------------------------
// POST /discovery/batch
// - customer sends filters in body (temporary)
// ---------------------------------------------------
const getDiscoveryBatchWithCustomFiltersService = async (authUser, query, body) => {
  const userId ="69881c8f04c3ff643148c27c";
  if (!userId) throw new AppError(401, "Unauthorized");

  const limit = Math.min(Math.max(parseInt(query.limit || "20", 10), 1), 50);
  const cursor = query.cursor;

  const me = await User.findById(userId).select("genderPreference location isProfileComplete");
  if (!me) throw new AppError(404, "User not found");

  const { dbQuery, cutoff } = await buildBaseQuery(userId);

  // Always apply gender preference
  applyGenderPreference(dbQuery, me);

  // Apply CUSTOM filters from body (temporary)
  const safeCustom = sanitizeFilters(body || {});
  const appliedFilters = applyFiltersToQuery(dbQuery, me, safeCustom);

  const { users, nextCursor } = await fetchUsersByCursor(dbQuery, cursor, limit);

  return {
    mode: "custom_filters",
    cooldownHours: COOLDOWN_HOURS,
    cooldownCutoff: cutoff,
    limit,
    cursor: cursor || null,
    nextCursor,
    hasMore: !!nextCursor,
    users,
    appliedFilters,
  };
};

export const discoveryServices = {
  getDiscoveryBatchService,
  getDiscoveryBatchWithCustomFiltersService,
};
