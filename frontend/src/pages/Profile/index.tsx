import EnderecoTab from "@/components/EnderecoTab";
import MeuPerfilTab from "@/components/MeuPerfilTab";
import MeusPedidosTab from "@/components/MeusPedidosTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContext } from "@/UserContext";
import { useContext } from "react";

const index = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Header must be used within a UserProvider");
  }

  const { isLogged, endereco, logout } = userContext;

  if (!isLogged) {
    return (
      <div className="p-5">
        <h1 className="text-4xl text-center p-5">Usuário não está logado</h1>
      </div>
    );
  }
  return (
    <div className="p-5">
      <Tabs defaultValue="meu-perfil" className="w-full">
        <TabsList className="flex justify-around">
          <TabsTrigger value="meu-perfil">Meu Perfil</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="meus-pedidos">Meus Pedidos</TabsTrigger>
        </TabsList>
        <TabsContent value="meu-perfil">
          <MeuPerfilTab user={userContext} />
        </TabsContent>
        <TabsContent value="endereco">
          <EnderecoTab endereco={endereco} />
        </TabsContent>
        <TabsContent value="meus-pedidos">
          <MeusPedidosTab user={userContext} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default index;
