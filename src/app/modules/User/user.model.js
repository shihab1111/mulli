import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    // Account
    phone: { type: String },
    email: { type: String },
    shareEmail: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // Profile
    firstName: { type: String },
    lastName: { type: String },
    birthdate: Date,
    trackactivity: { type: String, enum: ["Once", "While_Using", "No"], default: "No" },
    gender: { type: String, enum: ["Men", "Women", "Nonbinary", "ALL"], },
    genderPreference: { type: String, enum: ["Men", "Women", "Nonbinary", "ALL"], },
    hopingToFind: { type: String, enum: ["Long_Term", "Casual", "Ethical"], },
    ethnicity: { type: String },
    country: { type: String },
    religion: { type: String },
    skillLevel: { type: String, enum: ["Beginner", "Novice", "Intermediate", "Advanced", "Expert"], },
    handicaprange: { minRange: { type: Number, default: 0 }, maxRange: { type: Number, default: 100 } },

    height: { type: Number, default: 0 },
    hasKids: { type: Boolean, default: false },
    wantsKids: { type: String, default: false },
    drinking: { type: String },
    smoking: { type: String },
    images: [String],
    prompt: [{ type: String }],
    playstyle: { type: String, enum: ["Golf_Buddy", "Golf_Date"] },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
      placeName: { type: String },
    },
    useLocation: { type: Boolean, default: false },
    reciveNotifications: { type: Boolean, default: true },
    profileImage: { type: String },
    enableFaceId: { type: Boolean, default: false },
    coins: { type: Number, default: 0 },

  },
  { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", UserSchema);
export default User;