import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkedTodo, editTodo } from "./api/post_request";
import type { toast } from "react-toastify";
import { useEffect, useState } from "react";

type Todo = {
  _id: string | null;
  todo: string;
  author: string;
  isComplete: boolean;
};
type TodoListProps = {
  todo: Todo;
  handleDelete: (todoId: string) => void;
  toast: typeof toast;
};

type Query = {
  isSuccess: boolean;
  todos: Todo[];
};

const TodoList = ({ todo, handleDelete, toast }: TodoListProps) => {
  const [edit, setEdit] = useState<string>("");

  useEffect(() => {
    setEdit(todo.todo);
  }, [todo]);

  const queryClient = useQueryClient();
  const [isEdite, setIsEdite] = useState(false);
  const handleCheckedTodo = useMutation({
    mutationFn: checkedTodo,
    onMutate: () => {
      todo.isComplete = true;
    },
    onError: () => {
      todo.isComplete = false;
      toast.error("Something went wrong");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleChecked = () => {
    handleCheckedTodo.mutate(todo._id as string);
  };

  const mutationEditTodo = useMutation({
    mutationFn: editTodo,
    onMutate: async ({
      todoId,
      newTodo,
    }: {
      todoId: string;
      newTodo: string;
    }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]) as
        | Query
        | undefined;
      queryClient.setQueryData(["todos"], (old: Query) => {
        return {
          ...old,
          todos: old.todos.filter((todo) => {
            if (todo._id === todoId) {
              todo.todo = newTodo;
              console.log(todo.todo);
              return todo;
            }
            return todo;
          }),
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

  const handleEditTodo = () => {
    if (edit === "") {
      toast.error("Can not save empty Todo");
      return;
    }
    setIsEdite(!isEdite);
    mutationEditTodo.mutate({ todoId: todo._id as string, newTodo: edit });
  };

  return (
    // Chekced button
    <div className="flex py-2 border-b mb-4">
      <input
        type="checkbox"
        checked={todo.isComplete}
        onClick={handleChecked}
      />
      {/* Todo */}

      {!isEdite && (
        <div
          className={`grow ml-4  ${todo.isComplete ? "line-through text-gray-500" : ""}`}
        >
          {todo.todo}
        </div>
      )}
      {/* Edit input */}
      {isEdite && (
        <input
          onChange={(e) => setEdit(e.target.value)}
          value={edit}
          type="text"
          className=" w-full grow ml-4 outline-0"
        />
      )}
      {/* Edite button */}
      {!isEdite && (
        <button className="mx-3" onClick={() => setIsEdite(!isEdite)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1_20437)">
              <path
                d="M5 16L4 20L8 19L19.5858 7.41421C20.3668 6.63316 20.3668 5.36683 19.5858 4.58579L19.4142 4.41421C18.6332 3.63316 17.3668 3.63317 16.5858 4.41421L5 16Z"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 6L18 9"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13 20H21"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_20437">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      )}

      {/* Accept edite */}
      {isEdite && (
        <button className="mx-3" onClick={handleEditTodo}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1_20103)">
              <path
                d="M20 7L10 17L5 12"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_20103">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      )}

      {/* Cancel edit */}
      {isEdite && (
        <button className="mx-3" onClick={() => setIsEdite(!isEdite)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1_20121)">
              <path
                d="M7 7L17 17M7 17L17 7"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_20121">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      )}

      {/* Delete todo */}
      {!isEdite && (
        <button
          className="pl-4 pr-2"
          onClick={() => handleDelete(todo._id as string)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1_20431)">
              <path
                d="M14 11V17"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11V17"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 7V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V7"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 7H20"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 7L9 3H15L17 7"
                stroke="#292929"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_20431">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      )}
    </div>
  );
};

export default TodoList;
