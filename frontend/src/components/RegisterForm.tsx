import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import LoadingIcon from "./ui/loading";
import { FloatingLabelInput } from "./ui/floating-label-input";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "@/UserContext";

type RegisterFormFields = {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
};

function RegisterForm() {

  const apiURL = import.meta.env.VITE_API_URL;

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext not found");
  }

  const { setUserData } = userContext;

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormFields>();

  const onSubmit: SubmitHandler<RegisterFormFields> = async (data) => {
    const postData = {
      nome: data.nome,
      telefone: data.telefone,
      endereco: {
        rua: "indefinido",
        numero: 0,
        complemento: "indefinido",
        bairro: "indefinido",
        cidade: "indefinido",
        estado: "indefinido",
        cep: "indefinido",
      },
      email: data.email,
      senha: data.senha,
    };
    axios
      .post(apiURL + "/usuarios/cadastrar/", postData)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error(error.message);
        if (error.response.status === 409)
          setError("root", {
            message: "Email já cadastrado",
          });
      });
  };

  const senha = watch("senha");

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FloatingLabelInput id="Nome" label="Nome" {...register("nome", { required: "Insira o nome" })} />
      {errors.nome && <div className="text-error text-sm">{errors.nome.message}</div>}
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
      />
      {errors.email && <div className="text-error text-sm">{errors.email.message}</div>}
      <FloatingLabelInput
        id="Telefone"
        label="Telefone"
        {...register("telefone", {
          required: "Insira o telefone",
          pattern: {
            value: /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}\-?\d{4})$/,
            message: "Insira um telefone válido",
          },
        })}
        type="text"
        inputMode="numeric"
      />
      {errors.telefone && <div className="text-error text-sm">{errors.telefone.message}</div>}
      <FloatingLabelInput
        id="Senha"
        label="Senha"
        {...register("senha", {
          required: "Insira uma senha",
          minLength: {
            value: 4,
            message: "A senha precisa conter no mínimo 4 caracteres",
          },
        })}
        type="password"
        autoComplete="off"
      />
      {errors.senha && <div className="text-error text-sm">{errors.senha.message}</div>}
      <FloatingLabelInput
        id="Confirme a Senha"
        label="Confirme a Senha"
        {...register("confirmarSenha", {
          validate: (value) => value === senha || "As senhas não são iguais",
        })}
        type="password"
        autoComplete="off"
      />
      {errors.confirmarSenha && <div className="text-error text-sm">{errors.confirmarSenha.message}</div>}
      <Button className="w-full text-slate-100" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingIcon /> : "Registrar"}
      </Button>
      {errors.root && <div className="text-error text-sm">{errors.root.message}</div>}
    </form>
  );
}

export default RegisterForm;
