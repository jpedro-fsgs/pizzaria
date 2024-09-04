import { Product } from "@/CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CirclePlus } from "lucide-react";
import PizzaCarousel from "./PizzaCarousel";


const ProductCardModal = ({ produto }: { produto: Product }) => {
  return (
    <Dialog>
      <DialogTrigger className="btn btn-lg btn-circle btn-ghost"><CirclePlus className="text-primary" size="100%" /></DialogTrigger>
      <DialogContent className="bg-base-100">
        <DialogHeader>
          <DialogTitle>{produto.nome}</DialogTitle>
          <DialogDescription>{produto.descricao}</DialogDescription>
        </DialogHeader>
        <PizzaCarousel imagens={produto.url_imagens} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCardModal;
