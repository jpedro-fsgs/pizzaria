import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "@/UserContext";
import LoadingIcon from "./ui/loading";

function RegisterForm() {
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <form className="space-y-4" onSubmit={handleSignUpSubmit}>
      <Input placeholder="Nome" required />
      <Input placeholder="Email" type="email" required />
      <Input placeholder="Telefone" type="text" required />
      <Input placeholder="Senha" type="password" required autoComplete="off" />
      <Input placeholder="Confirme a Senha" type="password" required autoComplete="off" />
      <Button className="w-full text-slate-100">Registrar</Button>
    </form>
  );
}

type LoginFormFields = {
  email: string;
  password: string;
};

function LoginForm() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext not found");
  }

  const { setToken } = userContext;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>();

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    const postData = new URLSearchParams({
      username: data.email,
      password: data.password,
    });
    // await new Promise(resolve => setTimeout(resolve, 1500));
    axios
      .post("http://localhost:2130/auth/token", postData)
      .then((response) => {
        setToken(response.data.access_token);
      })
      .catch((error) => {
        console.error(error.message)
        if(error.response.status === 401)
        setError("root", {
          message: "Credenciais Inválidas"
        })
      });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email", {
          required: "Insira um email",
          pattern: {
            value: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
            message: "Insira um email válido",
          },
        })}
        placeholder="Email"
        type="text"
        autoComplete="on"
      />
      {errors.email && <div className="text-error text-sm">{errors.email.message}</div>}
      <Input
        {...register("password", {
          required: "Insira uma senha",
          minLength: {
            value: 4,
            message: "A senha precisa conter no mínimo 4 caracteres",
          },
        })}
        placeholder="Senha"
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

const Login = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="hover:brightness-90 hover:bg-secondary bg-secondary w-10 h-10 md:w-12 md:h-12 transition duration-200" aria-label="Abrir login do usuário">
          <User className="h-6 w-6 transition duration-200 text-primary" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-base-100 max-md:w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-neutral">Logar ou Registrar</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Logar</TabsTrigger>
            <TabsTrigger value="signup">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
