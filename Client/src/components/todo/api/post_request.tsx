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

const currentUser: user = JSON.parse(localStorage.getItem("user") as string);

const addTodo = async (newTodo: { todo: string; author: string }) => {
  const res = await fetch("/api/user/todo/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser.token}`,
    },
    body: JSON.stringify({ todo: newTodo.todo, author: newTodo.author }),
  });

  if (!res.ok) {
    throw res.json();
  }
  return res.json();
};

const deleteTodo = async (todoId: string) => {
  console.log("delete");
  const res = await fetch(`/api/user/todo/delete/${todoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser.token}`,
    },
  });
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
};

const checkedTodo = async (todoId: string) => {
  const res = await fetch(`/api/user/todo/checked/${todoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser.token}`,
    },
  });
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
};

const editTodo = async ({
  todoId,
  newTodo,
}: {
  todoId: string;
  newTodo: string;
}) => {
  const res = await fetch(`/api/user/todo/edit/${todoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentUser.token}`,
    },
    body: JSON.stringify({ newTodo }),
  });
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
};

export { addTodo, deleteTodo, checkedTodo, editTodo };
