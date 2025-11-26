import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

type error = {
  isSuccess: Boolean;
  err: String;
};

type user = {
  email: string;
  password: string;
  fname: string;
  lname: string;
};

type loggedUser = { isSuccess: boolean; token: string; user: user };

const signUpSchema = z.object({
  fname: z.string().nonempty("First Name is Empty"),
  lname: z.string().nonempty("Last Name is Empty"),
  email: z.email().nonempty("Email is Empty"),
  password: z.string().nonempty("Password is Empty"),
});

type SignUpData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState<SignUpData>({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const { mutate } = useMutation({
    mutationFn: async (input: SignUpData) => {
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data: error = await res.json();
        throw data;
      }
      const data: loggedUser = await res.json();
      return data;
    },
    onSuccess: (data: loggedUser) => {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/home");
    },
    onError: (error: error) => {
      toast.error(error.err);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const parse = signUpSchema.safeParse(input);
    if (!parse.success) {
      const errorMessage = z.flattenError(parse.error);
      const error =
        errorMessage.fieldErrors.fname ||
        errorMessage.fieldErrors.lname ||
        errorMessage.fieldErrors.email ||
        errorMessage.fieldErrors.password;
      toast.error(error?.at(-1));
      return;
    }
    mutate(input);
  };

  return (
    <div className="flex justify-center items-center h-dvh bg-[#1D546C]">
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
      <form
        className=" flex flex-col p-10 max-w-lg w-full m-auto *:p-2 rounded-2xl 
            *:rounded-md outline-gray-300 outline-2 bg-white
            [&>input]:bg-gray-100
            "
      >
        <label htmlFor="fname">First Name</label>
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          onChange={handleChange}
        />
        <label htmlFor="lname">Last Name</label>
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          onChange={handleChange}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button
          className="bg-[#1D546C] mt-9 text-white font-bold "
          type="button"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        <button
          className="bg-[#EFECE3] mt-3 font-bold "
          type="button"
          onClick={() => navigate("/")}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default SignUp;
