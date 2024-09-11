import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { Categoria, Product } from "@/components/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

const Menu = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      axios
        .get("http://localhost:2130/categorias/")
        .then((response) => {
          setCategorias(response.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Não foi possível conectar ao servidor");
        })
        .finally(() => setLoading(false));
    };

    fetchData();
  }, []);

  return (
    <main className="mx-auto py-8 space-y-16">
      <h1 className="text-5xl mt-16 mx-16">Conheça nosso Menu</h1>
      <div className="">
        {loading ? (
          <>
            <h2 className="text-primary text-5xl font-bold m-16">{<Skeleton className="h-16 w-96 bg-neutral-content" />}</h2>
            <div className="flex flex-wrap justify-center gap-5">
              {Array.from({length: Math.floor(Math.random() * 4) + 4}).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : (
          categorias.map((categoria, index) => {
            return (
              <div key={index}>
                <h2 className="text-primary text-5xl font-bold m-16">{categoria.nome}</h2>
                <div className="flex flex-wrap justify-center gap-5">{categoria.produtos.length === 0 ? <p>Não há produtos</p> : categoria.produtos.map((produto: Product) => <ProductCard produto={produto} key={produto.id} />)}</div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};

export default Menu;
