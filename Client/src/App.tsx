import SignUp from "./components//auth/SignUp";
import { Routes, Route } from "react-router";
import SignIn from "./components/auth/SignIn";
import Todo from "./components/todo/Todo";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Todo />} />
      </Routes>
    </>
  );
};

export default App;
