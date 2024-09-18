import { UserContext } from "@/UserContext";
import axios from "axios";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import LoadingIcon from "./ui/loading";
import { FloatingLabelInput } from "./ui/floating-label-input";
import { resolve } from "path";

type LoginFormFields = {
  email: string;
  password: string;
};

function LoginForm() {
  const apiURL = import.meta.env.VITE_API_URL;
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext not found");
  }

  const { setToken, setUserData } = userContext;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>();

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const postData = new URLSearchParams({
      username: data.email,
      password: data.password,
    });
    axios
      .post(apiURL + "/auth/token/", postData)
      .then((response) => {;
        setUserData(response.data);
      })
      .catch((error) => {
        console.error(error.message);
        if (error.response.status === 401) {
          setError("root", {
            message: "Credenciais Inválidas",
          });
        }
      });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FloatingLabelInput
        id="Email"
        label="Email"
        {...register("email", {
          required: "Insira um email",
          pattern: {
            value: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
            message: "Insira um email válido",
          },
        })}
        type="text"
        autoComplete="on"
      />
      {errors.email && <div className="text-error text-sm">{errors.email.message}</div>}
      <FloatingLabelInput
        id="Senha"
        label="Senha"
        {...register("password", {
          required: "Insira uma senha",
          minLength: {
            value: 4,
            message: "A senha precisa conter no mínimo 4 caracteres",
          },
        })}
        type="password"
        autoComplete="on"
      />
      {errors.password && <div className="text-error text-sm">{errors.password.message}</div>}
      <Button className="w-full text-slate-100" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingIcon /> : "Logar"}
      </Button>
      {errors.root && <div className="text-error text-sm">{errors.root.message}</div>}
    </form>
  );
}

export default LoginForm;
