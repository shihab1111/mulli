import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Account
    phone: { type: String },
    email: { type: String },
    shareEmail: { type: Boolean, default: false },

    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    // Location (VERY IMPORTANT)
    location: { type: String,},

    // Profile
    name: String,
    birthdate: Date,
    height: Number,

    gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Other"],
    },

    genderPreference: {
      type: String,
      enum: ["Male", "Female", "Everyone"],
    },

    lookingFor: {
      type: String,
      enum: ["Casual", "Serious", "Golf Buddy"],
    },

    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Pro"],
    },

    playStyle: {
      type: String,
      enum: ["Casual", "Competitive"],
    },

    lifestyle: String,
    personality: String,
    prompt: String,

    hasKids: Boolean,
    ethnicity: String,
    country: String,

    profileImage: String,
    images: [String],

    enableFaceId: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    coins: { type: Number, default: 0 },
    // Discovery filters (stored preferences)
    filters: {
      minAge: { type: Number, default: 18 },
      maxAge: { type: Number, default: 60 },
      distance: { type: Number, default: 50 }, // km
      skillLevels: [String],
      goals: [String],
    },
  },
  { timestamps: true }
);



const User= mongoose.model("User", UserSchema);
export default User;