import LoadingIcon from "@/components/ui/loading";
import { UserContext } from "@/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UsuariosDashboard from "@/components/UsuariosDashboard";
import CategoriasDashboard from "@/components/CategoriasDashboard";
import ProdutosDashboard from "@/components/ProdutosDashboard";
import PedidosDashboard from "@/components/PedidosDashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  const userContext = useContext(UserContext);
  if (!userContext) {
    return;
  }

  const { adm, isLogged } = userContext;

  if (!isLogged) {
    return <div className="p-5 text-center">Faça login para acessar</div>;
  }

  if (isLogged && !adm) {
    navigate("/");
  }

  return (
    <div className="p-5 h-full">
      <Accordion type="single" collapsible className="h-full outline outline-base-200 rounded p-3 space-y-4">
        <AccordionItem value="usuarios" className="bg-base-200 px-3 rounded">
          <AccordionTrigger>Usuários</AccordionTrigger>
          <AccordionContent>
            <UsuariosDashboard userContext={userContext} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="categorias" className="bg-base-200 px-3 rounded">
          <AccordionTrigger>Categorias</AccordionTrigger>
          <AccordionContent>
            <CategoriasDashboard />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="produtos" className="bg-base-200 px-3 rounded">
          <AccordionTrigger>Produtos</AccordionTrigger>
          <AccordionContent>
            <ProdutosDashboard />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pedidos" className="bg-base-200 px-3 rounded">
          <AccordionTrigger>Pedidos</AccordionTrigger>
          <AccordionContent>
            <PedidosDashboard />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Dashboard;
