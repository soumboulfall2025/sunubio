import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    console.log("authUser middleware triggered");

    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: token_decode.id }; // <-- ici !
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser