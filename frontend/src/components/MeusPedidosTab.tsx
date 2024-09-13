import { UserContextType } from "@/UserContext"
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

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


const MeusPedidosTab = ({ user }:{user: UserContextType}) => {

  const fetchMeusPedidos = async () =>{
    const { data } = await axios.get<Pedido[]>("http://localhost:2130/pedidos/usuario", {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return data;
  }
  
  const { data: meusPedidos, error, isLoading } = useQuery([`categorias-${user.id}`], fetchMeusPedidos);

  if (error || meusPedidos === undefined) {
    console.error(error);
    return (
      <div className="p-5">
        <h1 className="text-4xl text-center p-5">Não foi possível conectar ao servidor</h1>
      </div>
    );
  }
  
  return (
  
    <div>{meusPedidos.map(pedido => <p>{new Date(pedido.horario_pedido).toLocaleString()}</p>)}</div>
  )
}

export default MeusPedidosTab