import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useContext, useEffect, useState } from "react";
import { FloatingLabelInput } from "./ui/floating-label-input";
import { UserContext } from "@/UserContext";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "./ui/button";
import LoadingIcon from "./ui/loading";
import { toast } from "sonner";
import { dir } from "node:console";

type EditPerfilFormFields = {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
};

const EditPerfil = ({ children }: { children: ReactNode }) => {
  const apiURL = import.meta.env.VITE_API_URL;

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext not found");
  }

  const { setUserData, nome, email, telefone, token } = userContext;

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting, dirtyFields, isDirty },
  } = useForm<EditPerfilFormFields>({
    defaultValues: {
      nome,
      email,
      telefone,
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit: SubmitHandler<EditPerfilFormFields> = async (data) => {
    const putData = {
      nome: dirtyFields.nome ? data.nome : "",
      telefone: dirtyFields.telefone ? data.telefone : "",
      email: dirtyFields.email ? data.email : "",
      senha: dirtyFields.senha ? data.senha : "",
    };
    await new Promise((response) => setTimeout(response, 1500));
    console.table(putData);
    axios
      .put(apiURL + "/usuarios/editar/", putData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      .then((response) => {
        setUserData(response.data);
        setOpen(false);
        reset({
          nome: response.data.nome,
          email: response.data.email,
          telefone: response.data.telefone,
          senha: "",
          confirmarSenha: "",
        })
        toast.success("Dados alterados com sucesso");
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

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="btn">{children}</DialogTrigger>
      <DialogContent className="bg-base-100 max-md:w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>Editar Dados</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FloatingLabelInput id="Nome" label="Nome" {...register("nome")} />
            {errors.nome && <div className="text-error text-sm">{errors.nome.message}</div>}
            <FloatingLabelInput
              id="Email"
              label="Email"
              {...register("email", {
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
                minLength: {
                  value: 4,
                  message: "A senha precisa conter no mínimo 4 caracteres",
                },
                required: false
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
                required: false
              })}
              type="password"
              autoComplete="off"
            />
            {errors.confirmarSenha && <div className="text-error text-sm">{errors.confirmarSenha.message}</div>}
            <Button className="w-full text-slate-100" type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? <LoadingIcon /> : "Editar"}
            </Button>
            {errors.root && <div className="text-error text-sm">{errors.root.message}</div>}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPerfil;
