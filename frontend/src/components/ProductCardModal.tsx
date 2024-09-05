import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CirclePlus, ShoppingCartIcon } from "lucide-react";
import PizzaCarousel from "./PizzaCarousel";
import { Product } from "./types/product";
import ProductPrices from "./ProductPrices";
import { useState } from "react";
import ProductAdditionals from "./ProductAdditionals";

const ProductCardModal = ({ produto }: { produto: Product }) => {
  const [preco, setPreco] = useState<number>(0);
  const [precoAdicionais, setPrecoAdicionais] = useState<number>(0);

  return (
    <Dialog>
      <DialogTrigger className="btn btn-lg btn-circle btn-ghost">
        <CirclePlus className="text-primary" size="100%" />
      </DialogTrigger>
      <DialogContent className="bg-base-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-normal text-primary">{produto.nome}</DialogTitle>
        </DialogHeader>
        <PizzaCarousel imagens={produto.url_imagens} />
        <div>
          <div className="flex flex-col items-center text-center space-y-5">
            <DialogDescription className="italic max-h-32 overflow-auto">{produto.descricao}</DialogDescription>

            <ProductPrices produto={produto} preco={preco} setPreco={setPreco} />

            {produto.adicionais.length > 0 && <ProductAdditionals produto={produto} setPrecoAdicionais={setPrecoAdicionais} />}

            <div className="flex w-full mt-auto items-center justify-between p-4">
              <p className="text-2xl font-semibold">
                {
                preco !== 0 ? 
                `R$ ${(preco + precoAdicionais).toFixed(2)}` : 
                produto.preco.length > 1 ? 
                `R$ ${produto.preco[0].preco.toFixed(2)} - R$ ${produto.preco[produto.preco.length - 1].preco.toFixed(2)}` : 
                `R$ ${produto.preco[0].preco.toFixed(2)}`
                }
              </p>
              <ShoppingCartIcon />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCardModal;
