import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const LoginModal = ({children}:{children: ReactNode}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
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

export default LoginModal;
