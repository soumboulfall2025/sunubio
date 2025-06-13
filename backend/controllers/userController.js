import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto";
import userModel from "../models/userModel.js"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// routes for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User does not exists" })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user.id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}


// routes for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, referredByCode } = req.body; // Ajoute referredByCode si fourni

        // Vérifier si l'utilisateur existe déjà
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validation email et mot de passe
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Générer un code de parrainage unique
        let referralCode;
        let isUnique = false;
        while (!isUnique) {
            referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const codeExists = await userModel.findOne({ referralCode });
            if (!codeExists) isUnique = true;
        }

        // Préparer le nouvel utilisateur
        const newUserData = {
            name,
            email,
            password: hashedPassword,
            referralCode,
            points: 0
        };

        // Gestion du parrainage
        if (referredByCode) {
            const parrain = await userModel.findOne({ referralCode: referredByCode });
            if (parrain) {
                newUserData.points = 100; // Bonus filleul
                newUserData.referredBy = referredByCode;
                // Le parrain sera crédité après le premier achat du filleul
            }
        }

        const newUser = new userModel(newUserData);
        const user = await newUser.save();

        const token = createToken(user.id);

        res.json({ success: true, token, referralCode: user.referralCode, points: user.points });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// routes for admin login 
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' })

            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("name email points referralCode referredBy");
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Aucun utilisateur avec cet email." });
        }

        // Générer un token unique
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpire = Date.now() + 1000 * 60 * 30; // 30 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpire;
        await user.save();

        // Ici tu devrais envoyer un email avec le lien de reset
        // Pour test, on renvoie le lien dans la réponse :
        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
        res.json({ success: true, message: "Lien de réinitialisation envoyé.", resetLink });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.json({ success: false, message: "Lien invalide ou expiré." });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Mot de passe trop court." });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ success: true, message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, getUserProfile, forgotPassword, resetPassword }