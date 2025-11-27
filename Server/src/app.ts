import express from "express";
import path from "path";
const app = express();
import authRouter from "./auth";
import todo from "./todo";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authorization = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.split(" ")[1];
    jwt.verify(token as string, process.env.JWT_SECRET as string);

    next();
  } catch {
    res.status(401).json({ isSuccess: false, err: "Unauthorized" });
  }
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist")));

app.use("/api/auth", authRouter);
app.use("/api/user", authorization, todo);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server is ruining on ", PORT);
});

export default app;
