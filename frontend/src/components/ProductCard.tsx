import ProductCardModal from "./ProductCardModal";
import { Product } from "./types/product";

const ProductCard = ({ produto }: { produto: Product }) => {
  const precos = [...produto.preco].sort((a, b) => a.preco - b.preco);

  return (
    <div className="bg-base-100 w-80 rounded-lg shadow-xl p-5">
      <figure className="m-6 p-2 bg-neutral-content rounded-xl">
        <img src={"/pizza-images/" + produto.url_imagens[0]} alt={"Imagem " + produto.nome} className="rounded-xl h-36 mx-auto" />
      </figure>
      <div className="flex flex-col items-center text-center space-y-5">
        <h2 className="text-3xl font-normal text-primary">{produto.nome}</h2>

        {/* <div className="flex w-full mt-auto items-center justify-between p-4"> */}
        <p className="text-2xl font-semibold">{precos.length > 1 ? `R$ ${precos[0].preco} - R$ ${precos[precos.length - 1].preco}` : `R$ ${precos[0].preco}`}</p>
        <ProductCardModal produto={produto} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default ProductCard;
