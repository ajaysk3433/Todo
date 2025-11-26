import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.hobczgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Unable to connect to MongoDB", err);
  }
})();

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: {
    type: String,
    select: false,
  },
});

const notesSchema = new mongoose.Schema({
  todo: String,
  author: mongoose.Schema.Types.ObjectId,
  isComplete: {
    type: Boolean,
    default: false,
  },
});

export const todos = mongoose.model("Nodes", notesSchema);

export const user = mongoose.model("User", userSchema);
