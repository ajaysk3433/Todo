"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./db");
const router = express_1.default.Router();
router.get("/todos", (req, res) => {
    (async () => {
        try {
            const result = await db_1.todos.find({}, { __v: 0 }).lean();
            res.status(200).json({
                isSuccess: true,
                todos: result,
            });
        }
        catch (err) {
            console.error(err);
            res.status(503).json({ isSuccess: false, err: "Something went wrong" });
        }
    })();
});
router.post("/todo/create", (req, res) => {
    const data = req.body;
    (async () => {
        try {
            const result = await db_1.todos.create({
                todo: data.todo,
                author: new mongoose_1.default.Types.ObjectId(data.author),
            });
            res.status(200).json({
                isSuccess: true,
                todos: { _id: result._id, todo: result.todo, author: result.author },
            });
        }
        catch (err) {
            console.error(err);
            res.status(503).json({ isSuccess: false, err: "Something went wrong" });
        }
    })();
});
router.delete("/todo/delete/:todoId", (req, res) => {
    const { todoId } = req.params;
    console.log("todoId", todoId);
    (async () => {
        try {
            const result = await db_1.todos.deleteOne({
                _id: new mongoose_1.default.Types.ObjectId(todoId),
            });
            if (result.acknowledged) {
                res.status(200).json({
                    isSuccess: true,
                });
            }
            else {
                res.status(503).json({ isSuccess: false, err: "" });
            }
        }
        catch (err) {
            console.error(err);
            res.status(503).json({ isSuccess: false, err: "Unable to Delete" });
        }
    })();
});
router.patch("/todo/checked/:todoId", (req, res) => {
    const { todoId } = req.params;
    (async () => {
        try {
            const result = await db_1.todos.updateOne({
                _id: new mongoose_1.default.Types.ObjectId(todoId),
            }, [
                {
                    $set: {
                        isComplete: { $not: "$isComplete" },
                    },
                },
            ]);
            if (result.acknowledged) {
                res.status(200).json({
                    isSuccess: true,
                });
            }
            else {
                res.status(503).json({ isSuccess: false, err: "Something went wrong" });
            }
        }
        catch (err) {
            console.error(err);
            res.status(503).json({ isSuccess: false, err: "Unable to Delete" });
        }
    })();
});
router.patch("/todo/edit/:todoId", (req, res) => {
    const { todoId } = req.params;
    const newTodo = req.body;
    console.log("edit", newTodo);
    (async () => {
        try {
            const result = await db_1.todos.updateOne({
                _id: new mongoose_1.default.Types.ObjectId(todoId),
            }, {
                $set: {
                    todo: newTodo.newTodo,
                },
            });
            if (result.acknowledged) {
                res.status(200).json({
                    isSuccess: true,
                });
            }
            else {
                res.status(503).json({ isSuccess: false, err: "Something went wrong" });
            }
        }
        catch (err) {
            console.error(err);
            res.status(503).json({ isSuccess: false, err: "Unable to edit" });
        }
    })();
});
exports.default = router;
