"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.todos = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(async () => {
    try {
        await mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.hobczgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.log("Unable to connect to MongoDB", err);
    }
})();
const userSchema = new mongoose_1.default.Schema({
    fname: String,
    lname: String,
    email: String,
    password: {
        type: String,
        select: false,
    },
});
const notesSchema = new mongoose_1.default.Schema({
    todo: String,
    author: mongoose_1.default.Schema.Types.ObjectId,
    isComplete: {
        type: Boolean,
        default: false,
    },
});
exports.todos = mongoose_1.default.model("Nodes", notesSchema);
exports.user = mongoose_1.default.model("User", userSchema);
