"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Helper: JWT Secret (you can fallback if not set)
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// -------------------- SIGNUP --------------------
router.post("/signup", async (req, res) => {
    try {
        const data = req.body;
        data.email = data.email.toLowerCase();
        const isExist = await db_1.user.findOne({ email: data.email });
        if (isExist) {
            return res
                .status(403)
                .json({ isSuccess: false, err: "Email already exists" });
        }
        const newUser = (await db_1.user.create(data)).toObject();
        delete newUser.password;
        const token = jsonwebtoken_1.default.sign({ email: newUser.email }, JWT_SECRET);
        return res.status(200).json({ isSuccess: true, token, user: newUser });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ isSuccess: false, err: "Something went wrong" });
    }
});
// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
    try {
        const data = req.body;
        data.email = data.email.toLowerCase();
        const isExist = await db_1.user
            .findOne({ email: data.email, password: data.password })
            .lean();
        if (!isExist) {
            return res.status(404).json({ isSuccess: false, err: "User not found" });
        }
        const token = jsonwebtoken_1.default.sign({ email: isExist.email }, JWT_SECRET);
        return res.status(200).json({ isSuccess: true, token, user: isExist });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ isSuccess: false, err: "Something went wrong" });
    }
});
exports.default = router;
