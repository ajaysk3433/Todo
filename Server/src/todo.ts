import express from "express";
import mongoose from "mongoose";
import { todos } from "./db";
import { todo } from "node:test";
const router = express.Router();

router.get("/todos", (req, res) => {
  (async () => {
    try {
      const result = await todos.find({}, { __v: 0 }).lean();

      res.status(200).json({
        isSuccess: true,
        todos: result,
      });
    } catch (err) {
      console.error(err);
      res.status(503).json({ isSuccess: false, err: "Something went wrong" });
    }
  })();
});

router.post("/todo/create", (req, res) => {
  const data = req.body as { todo: string; author: string };

  (async () => {
    try {
      const result = await todos.create({
        todo: data.todo,
        author: new mongoose.Types.ObjectId(data.author),
      });

      res.status(200).json({
        isSuccess: true,
        todos: { _id: result._id, todo: result.todo, author: result.author },
      });
    } catch (err) {
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
      const result = await todos.deleteOne({
        _id: new mongoose.Types.ObjectId(todoId),
      });

      if (result.acknowledged) {
        res.status(200).json({
          isSuccess: true,
        });
      } else {
        res.status(503).json({ isSuccess: false, err: "" });
      }
    } catch (err) {
      console.error(err);
      res.status(503).json({ isSuccess: false, err: "Unable to Delete" });
    }
  })();
});

router.patch("/todo/checked/:todoId", (req, res) => {
  const { todoId } = req.params;

  (async () => {
    try {
      const result = await todos.updateOne(
        {
          _id: new mongoose.Types.ObjectId(todoId),
        },
        [
          {
            $set: {
              isComplete: { $not: "$isComplete" },
            },
          },
        ]
      );

      if (result.acknowledged) {
        res.status(200).json({
          isSuccess: true,
        });
      } else {
        res.status(503).json({ isSuccess: false, err: "Something went wrong" });
      }
    } catch (err) {
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
      const result = await todos.updateOne(
        {
          _id: new mongoose.Types.ObjectId(todoId),
        },

        {
          $set: {
            todo: newTodo.newTodo,
          },
        }
      );

      if (result.acknowledged) {
        res.status(200).json({
          isSuccess: true,
        });
      } else {
        res.status(503).json({ isSuccess: false, err: "Something went wrong" });
      }
    } catch (err) {
      console.error(err);
      res.status(503).json({ isSuccess: false, err: "Unable to edit" });
    }
  })();
});

export default router;
