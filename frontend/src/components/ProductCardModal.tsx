import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CirclePlus, ShoppingCartIcon } from "lucide-react";
import PizzaCarousel from "./PizzaCarousel";
import { Product } from "./types/product";
import ProductPrices from "./ProductPrices";
import { useContext, useState } from "react";
import ProductAdditionals from "./ProductAdditionals";
import { CartContext } from "../CartContext";
const ProductCardModal = ({ produto, open, setOpen }: { produto: Product; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; }) => {
  const [preco, setPreco] = useState<number>(0);
  const [tamanho, setTamanho] = useState<string>("");
  const [precoAdicionais, setPrecoAdicionais] = useState<number>(0);
  const [adicionais, setAdicionais] = useState<string[]>([]);

  const cartContext = useContext(CartContext);




  if (!cartContext) {
    throw new Error("Header must be used within a CartProvider");
  }

  const { addItem } = cartContext;

  const handleAddProdutoToCart = () => {
    addItem({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: preco + precoAdicionais,
      tamanho: tamanho,
      url_imagens: produto.url_imagens,
      adicionais: adicionais,
      id_categoria: produto.id_categoria,
      quantidade: 1,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

            <ProductPrices produto={produto} preco={preco} setPreco={setPreco} tamanho={tamanho} setTamanho={setTamanho}/>

            {produto.adicionais.length > 0 && <ProductAdditionals produto={produto} setAdicionais={setAdicionais} setPrecoAdicionais={setPrecoAdicionais} />}

            <div className="sm:flex max-sm:space-y-5 w-full mt-auto items-center justify-between p-4">
              <p className="text-2xl font-semibold">{preco !== 0 ? `R$ ${(preco + precoAdicionais).toFixed(2)}` : produto.preco.length > 1 ? `R$ ${produto.preco[0].preco.toFixed(2)} - R$ ${produto.preco[produto.preco.length - 1].preco.toFixed(2)}` : `R$ ${produto.preco[0].preco.toFixed(2)}`}</p>
              <button className="btn" onClick={handleAddProdutoToCart} disabled={preco === 0}>
                <p>Adicionar</p>
                <ShoppingCartIcon />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCardModal;
