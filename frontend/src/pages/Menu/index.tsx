import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { Categoria, Product } from "@/components/types/product";

const Menu = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    axios.get("http://localhost:2130/categorias/").then((response) => {
      setCategorias(response.data);
    });
  }, []);

  return (
    <main className="mx-auto w-3/4 py-8 space-y-16">
      <h1 className="text-5xl mt-16">Conheça nosso Menu</h1>
      <div className="">
        {categorias.map((categoria, index) => {
          return (
            <div key={index}>
              <h2 className="text-primary text-5xl font-bold my-16">
                {categoria.nome}
              </h2>
              <div className="flex flex-wrap justify-center gap-5">
                {categoria.produtos.length === 0 ? (
                  <p>Não há produtos</p>
                ) : (
                  categoria.produtos.map((produto: Product) => (
                    <ProductCard produto={produto} key={produto.id} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Menu;
