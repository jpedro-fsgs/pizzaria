import { FiPlusCircle } from "react-icons/fi";
import ProductCardModal from "./ProductCardModal";
import { Product } from "@/CartContext";


const ProductCard = ({ produto }: {produto: Product}) => {
  return (
    <div className="bg-base-100 w-80 rounded-lg shadow-xl p-5">
      <ProductCardModal produto={produto} />
      <figure className="m-6 p-2 bg-neutral-content rounded-xl">
        <img
          src={"/pizza-images/" + produto.url_imagens[0]}
          alt={"Imagem " + produto.nome}
          className="rounded-xl h-36 mx-auto"
        />
      </figure>
      <div className="flex flex-col items-center text-center space-y-5">
        <h2 className="text-3xl font-normal text-primary">{produto.nome}</h2>
        <p className="italic max-h-32 overflow-auto">{produto.descricao}</p>

        <div className="flex items-center gap-2">
          <input
            type="radio"
            name={"radio-" + produto.id}
            id={"pequena-" + produto.id}
            className="radio radio-sm"
            defaultChecked
          />
          <label htmlFor={"pequena-" + produto.id} className="">
            Pequena
          </label>
          <input
            type="radio"
            name={"radio-" + produto.id}
            id={"media-" + produto.id}
            className="radio radio-sm"
          />
          <label htmlFor={"media-" + produto.id} className="">
            Média
          </label>
          <input
            type="radio"
            name={"radio-" + produto.id}
            id={"grande-" + produto.id}
            className="radio radio-sm"
          />
          <label htmlFor={"grande-" + produto.id} className="">
            Grande
          </label>
        </div>
        <div className="flex w-full mt-auto items-center justify-between p-4">
          <p className="text-2xl font-semibold">
            R$ {produto.preco.toFixed(2)}
          </p>
          <label htmlFor={"produto-" + produto.id} className="btn btn-lg btn-circle btn-ghost">
            <FiPlusCircle className="text-primary" size="100%" />
          </label>
        </div>
      </div>
      {/* <label htmlFor="my_modal_7" className="btn">open modal</label> */}
    </div>
  );
};

export default ProductCard;
