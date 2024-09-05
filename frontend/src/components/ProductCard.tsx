import { useState } from "react";
import ProductCardModal from "./ProductCardModal";
import { Product } from "./types/product";

const ProductCard = ({ produto }: { produto: Product }) => {
    const [open, setOpen] = useState(false);
  return (
    <div onDoubleClick={() => setOpen(true)} className="bg-base-100 w-80 rounded-lg shadow-xl p-5 hover:scale-[1.01] hover:outline outline-base-200">
      <figure className="m-6 p-2 bg-neutral-content rounded-xl">
        <img src={"/pizza-images/" + produto.url_imagens[0]} alt={"Imagem " + produto.nome} className="rounded-xl h-36 mx-auto" />
      </figure>
      <div className="flex flex-col items-center text-center space-y-5">
        <h2 className="text-3xl font-normal text-primary">{produto.nome}</h2>

        <p className="text-2xl font-semibold">{produto.preco.length > 1 ? `R$ ${produto.preco[0].preco.toFixed(2)} - R$ ${produto.preco[produto.preco.length - 1].preco.toFixed(2)}` : `R$ ${produto.preco[0].preco.toFixed(2)}`}</p>
        <ProductCardModal produto={produto} open={open} setOpen={setOpen}/>
      </div>
    </div>
  );
};

export default ProductCard;
