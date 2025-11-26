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

const getTodos = async () => {
  const res = await fetch("/api/user/todos", {
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
    },
  });
  if (!res.ok) {
    throw res.json();
  }

  return res.json();
};

export { getTodos };
