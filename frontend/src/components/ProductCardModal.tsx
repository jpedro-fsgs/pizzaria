import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CirclePlus, ShoppingCartIcon } from "lucide-react";
import PizzaCarousel from "./PizzaCarousel";
import { Product } from "./types/product";
import ProductPrices from "./ProductPrices";
import { useState } from "react";
import ProductAdditionals from "./ProductAdditionals";

const ProductCardModal = ({ produto }: { produto: Product }) => {
  const [selectedPreco, setSelectedPreco] = useState<number>(0);
  const precos = [...produto.preco].sort((a, b) => a.preco - b.preco);

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

            <ProductPrices produto={produto} selectedPreco={selectedPreco} setSelectedPreco={setSelectedPreco} />

            {produto.adicionais.length > 0 && <ProductAdditionals produto={produto} />}
            
            <div className="flex w-full mt-auto items-center justify-between p-4">

              <p className="text-2xl font-semibold">{selectedPreco !== 0 ? `R$ ${selectedPreco}` : precos.length > 1 ? `R$ ${precos[0].preco} - R$ ${precos[precos.length - 1].preco}` : `R$ ${precos[0].preco}`}</p>
              <ShoppingCartIcon />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCardModal;
