import axios from "axios";
import ProductCard from "../../components/ProductCard";
import { Categoria, Product } from "@/components/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { useQuery } from "react-query";

const fetchCategorias = async () => {

  const apiURL = import.meta.env.VITE_API_URL;

  const { data } = await axios.get(apiURL + "/categorias/");
  return data;
};

const Menu = () => {
  const { data: categorias, error, isLoading } = useQuery(["categorias"], fetchCategorias);

  if (error) {
    console.error(error)
    return (
      <main className="mx-auto py-8 space-y-16">
        <h1 className="text-5xl text-center mt-16 mx-16">Não foi possível conectar ao servidor</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto py-8 space-y-16">
      <h1 className="text-5xl mt-16 mx-16">Conheça nosso Menu</h1>
      <div>
        {isLoading ? (
          <>
            <h2 className="text-primary text-5xl font-bold m-16">{<Skeleton className="h-16 max-w-96 bg-neutral-content" />}</h2>
            <div className="flex flex-wrap justify-center gap-5">
              {Array.from({ length: Math.floor(Math.random() * 4) + 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : (
          categorias.map((categoria: Categoria, index: number) => {
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
