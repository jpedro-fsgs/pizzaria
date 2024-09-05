import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";

const Login = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="hover:brightness-90 hover:bg-secondary bg-secondary w-10 h-10 md:w-12 md:h-12 transition duration-200" aria-label="Abrir login do usuário">
          <User className="h-6 w-6 transition duration-200 text-primary" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-base-100">
        <DialogHeader>
          <DialogTitle className="text-neutral">Logar ou Registrar</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Logar</TabsTrigger>
            <TabsTrigger value="signup">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form className="space-y-4">
              <Input placeholder="Email" type="email" required />
              <Input placeholder="Senha" type="password" required />
              <Button className="w-full">Logar</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form className="space-y-4">
              <Input placeholder="Nome" required />
              <Input placeholder="Email" type="email" required />
              <Input placeholder="Senha" type="password" required />
              <Input placeholder="Confirme a Senha" type="password" required />
              <Button className="w-full">Registrar</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
