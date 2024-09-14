import { UserContextType } from "@/UserContext";
import axios from "axios";
import { useQuery } from "react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingIcon from "./ui/loading";
import { Skeleton } from "./ui/skeleton";

interface Pedido {
  id: number;
  id_usuario: number;
  nome_usuario: string;
  produtos: Produto[];
  horario_pedido: string; // ou Date se for utilizado como objeto Date
  total: number;
}

interface Produto {
  id_produto: number;
  nome_produto: string;
  quantidade: number;
  preco: number;
  tamanho: string;
  adicionais: string[];
}

const MeusPedidosTab = ({ user }: { user: UserContextType }) => {
  const fetchMeusPedidos = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula atraso
    const { data } = await axios.get<Pedido[]>("http://localhost:2130/pedidos/usuario", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return data;
  };

  const { data: meusPedidos, error, isLoading } = useQuery([`categorias-${user.id}`], fetchMeusPedidos);

  if (error) {
    console.error(error);
    return (
      <div className="p-5">
        <h1 className="text-4xl text-center p-5">Não foi possível conectar ao servidor</h1>
      </div>
    );
  }

  return (
    <div className="md:w-3/4 max-h-[60vh] mx-auto rounded-lg overflow-y-auto">
      <Table className="bg-slate-100 table-zebra max-sm:text-center">
        <TableHeader className="bg-primary text-secondary">
          <TableRow>
            <TableHead className="text-left">Data</TableHead>
            <TableHead className="text-center">Produtos</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" overflow-y-auto">
          {isLoading || !meusPedidos ? (
            <TableRow className="p-5">
              <TableCell className="flex items-center gap-2 text-lg"><LoadingIcon /> Carregando...</TableCell>
            </TableRow>
          ) : (
            meusPedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>
                  <p>{new Date(pedido.horario_pedido).toLocaleDateString("pt-BR")}</p>
                  <p>{new Date(pedido.horario_pedido).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                </TableCell>
                <TableCell className="mx-auto w-52 space-y-2">
                  {pedido.produtos.map((produto, index) => (
                    <div key={index} className="">
                      <span className="text-base font-semibold">{produto.nome_produto}</span>
                      <span className="text-sm italic"> {produto.tamanho}</span>
                      <span className="text-sm italic"> x{produto.quantidade}</span>
                      <ul className="list-inside list-disc">
                        {produto.adicionais.map((adicional, index) => (
                          <li key={index}>{adicional}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-right text-lg font-semibold">
                  <h2>R$ {pedido.total.toFixed(2)}</h2>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MeusPedidosTab;
