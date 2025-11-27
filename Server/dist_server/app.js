"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const auth_1 = __importDefault(require("./auth"));
const todo_1 = __importDefault(require("./todo"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorization = (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        const token = auth?.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch {
        res.status(401).json({ isSuccess: false, err: "Unauthorized" });
    }
};
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../dist")));
app.use("/api/auth", auth_1.default);
app.use("/api/user", authorization, todo_1.default);
app.get("/*splat", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../dist", "index.html"));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server is ruining on ", PORT);
});
exports.default = app;
