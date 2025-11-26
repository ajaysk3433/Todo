import { useEffect, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addTodo, deleteTodo } from "./api/post_request";
import { ToastContainer, toast } from "react-toastify";
import { getTodos } from "./api/get_request";
import TodoList from "./TodoList";
import { useNavigate } from "react-router";

type Todos = {
  _id: string | null;
  todo: string;
  author: string;
  isComplete: boolean;
};

type Query = {
  isSuccess: boolean;
  todos: Todos[];
};

type user = {
  isSuccess: boolean;
  token: string;
  user: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
  };
};

const Todo = () => {
  const [input, setInput] = useState<string>("");
  const queryClient = useQueryClient();
  const currentUser: user = JSON.parse(localStorage.getItem("user") as string);
  const navigate = useNavigate();

  const { data, isFetched } = useQuery<Query>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const addNewTodo = useMutation({
    mutationFn: addTodo,
    onMutate: (newTodo: { todo: string; author: string }) => {
      queryClient.setQueryData(["todos"], (old: Query) => {
        if (!old) return old;
        return {
          ...old,
          todos: [
            ...old.todos,
            { _id: null, todo: newTodo.todo, author: newTodo.author },
          ],
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },

    onError: (err: { isSuccess: boolean; err: string }) => {
      console.error("Error", err);
      toast.error(err.err);
      queryClient.setQueryData(["todos"], (old: Query) => {
        return {
          ...old,
          todos: old.todos.filter((todo) => todo._id !== null),
        };
      });
    },
  });

  const handleAdd = () => {
    if (input === "") return;
    addNewTodo.mutate({ todo: input, author: currentUser.user._id });
    setInput("");
  };

  const deleteTodoById = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoId: string) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]) as
        | Query
        | undefined;
      queryClient.setQueryData(["todos"], (old: Query) => {
        return {
          ...old,
          todos: old.todos.filter((todo) => todo._id !== todoId),
        };
      });
      return { previousTodos };
    },
    onError: (
      err: { isSuccess: boolean; err: string },
      _variables,
      context
    ) => {
      toast.error(err.err);
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleDelete = (todoId: string) => {
    deleteTodoById.mutate(todoId);
  };
  return (
    <div className="flex justify-center items-center  pt-10 ">
      <div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
      <div className=" w-2xl  ">
        <div className="flex justify-between">
          <button> Hey! {currentUser.user.fname}</button>
          {/* Logout button */}
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1_20104)">
                <path
                  d="M9 4H19V18C19 19.1046 18.1046 20 17 20H9"
                  stroke="#292929"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 15L15 12M15 12L12 9M15 12H5"
                  stroke="#292929"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_20104">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        <div className="flex justify-center items-center ">
          <h1 className="text-4xl p-5">Todo List</h1>
        </div>
        <div className="flex mb-10">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className=" grow flex py-2 border-b  p-2 px-3  mr-5 outline-0"
            type="text"
            placeholder="Add new note"
          />
          <button onClick={handleAdd} className="border-b  p-2 px-3 ">
            Add
          </button>
        </div>
        {isFetched && data && data.todos.length === 0 ? (
          <img src="./public/empty.jpg" />
        ) : null}
        <div>
          {isFetched &&
            data?.todos.map((todo: Todos) => (
              <TodoList
                todo={todo}
                key={todo._id}
                handleDelete={handleDelete}
                toast={toast}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
