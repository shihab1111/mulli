import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Account
    phone: { type: String },
    email: { type: String },
    shareEmail: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
      placeName: { type: String },
    }
    ,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // Profile
    name: { type: String },
    birthdate: Date,
    height: { type: Number, default: 0 },
    gender: { type: String, enum: ["Male", "Female", "Non-binary", "Other"], },
    genderPreference: { type: String, enum: ["Male", "Female", "Everyone"], },
    lookingFor: { type: String, enum: ["Casual", "Serious", "Golf Buddy"], },
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Pro"], },
    playStyle: { type: String, enum: ["Casual", "Competitive"], },
    lifestyle: { type: String },
    personality: { type: String },
    prompt: { type: String },
    hasKids: { type: Boolean, default: false },
    ethnicity: { type: String },
    country: { type: String },
    profileImage: { type: String },
    images: [String],
    enableFaceId: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    coins: { type: Number, default: 0 },
    // Discovery filters (stored preferences)
    filters: {
      minAge: { type: Number, default: 18 },
      maxAge: { type: Number, default: 60 },
      distance: { type: Number, default: 50 },
      skillLevels: [String],
      goals: [String],
    },
  },
  { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", UserSchema);
export default User;