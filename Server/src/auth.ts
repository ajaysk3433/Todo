import express, { Request, Response } from "express";
import { user } from "./db";
import jwt from "jsonwebtoken";

const router = express.Router();

// Helper: JWT Secret (you can fallback if not set)
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// -------------------- SIGNUP --------------------
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const data = req.body as {
      email: string;
      password: string;
      fname: string;
      lname: string;
    };
    data.email = data.email.toLowerCase();

    const isExist = await user.findOne({ email: data.email });
    if (isExist) {
      return res
        .status(403)
        .json({ isSuccess: false, err: "Email already exists" });
    }

    const newUser = (await user.create(data)).toObject();
    delete newUser.password;

    const token = jwt.sign({ email: newUser.email }, JWT_SECRET);

    return res.status(200).json({ isSuccess: true, token, user: newUser });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ isSuccess: false, err: "Something went wrong" });
  }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const data = req.body as { email: string; password: string };
    data.email = data.email.toLowerCase();

    const isExist = await user
      .findOne({ email: data.email, password: data.password })
      .lean();

    if (!isExist) {
      return res.status(404).json({ isSuccess: false, err: "User not found" });
    }

    const token = jwt.sign({ email: isExist.email }, JWT_SECRET);

    return res.status(200).json({ isSuccess: true, token, user: isExist });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ isSuccess: false, err: "Something went wrong" });
  }
});

export default router;
