import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    points: { type: Number, default: 0 }, // Points fidélité
    referralCode: { type: String, unique: true, sparse: true }, // Code de parrainage
    referredBy: { type: String }, // Code du parrain
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema)
export default userModel