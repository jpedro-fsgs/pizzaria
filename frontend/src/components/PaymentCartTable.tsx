import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductCart } from "./types/product";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "@/CartContext";

const PaymentCartTable = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Header must be used within a CartProvider");
  }

  const { cart, cartSize, clearCart, editItem, removeItem } = cartContext;

  const plusItem = (product: ProductCart) => {
    editItem(product, product.quantidade + 1);
  };

  const minusItem = (product: ProductCart) => {
    if (product.quantidade > 1) {
      editItem(product, product.quantidade - 1);
      return;
    }
    removeItem(product);
  };

  return (
    <div className="space-y-5 py-10 w-full overflow-y-auto">
      {cart.map((product, index) => {
        return (
          <div key={index}>
            <div className="p-4 flex flex-col items-center md:grid md:grid-cols-3">
              <span className="flex gap-4 items-center md:justify-start">
                <img src={"/pizza-images/" + product.url_imagens[0]} className="size-16" />
                <span className="">
                  <h2 className="font-semibold text-xl text-primary mb-4">{product.nome}</h2>
                  {product.tamanho && <p className="italic text-sm">tamanho: {product.tamanho}</p>}
                  {product.adicionais.length > 0 && (
                    <span className="flex items-baseline gap-5">
                      <p className="italic text-sm">adicionais: </p>
                      <ul className="list-disc list-inside text-xs">
                        {product.adicionais.map((adicional, index) => (
                          <li key={index}>{adicional}</li>
                        ))}
                      </ul>
                    </span>
                  )}
                </span>
              </span>
              <span className="md:justify-center md:text-center items-center">
                <h2>Valor</h2>
                <p>R$ {(product.preco * product.quantidade).toFixed(2)}</p>
              </span>
              <div className="flex md:justify-end items-center">
                <button onClick={() => minusItem(product)} className="btn btn-ghost">
                  {product.quantidade > 1 ? <Minus /> : <Trash2 />}
                </button>
                <p className="text-2xl text-center w-14">{product.quantidade}</p>
                <button onClick={() => plusItem(product)} className="btn btn-ghost">
                  <Plus />
                </button>
              </div>
            </div>
            <Separator className="bg-primary" />
          </div>
        );
      })}
    </div>
  );
};

export default PaymentCartTable;
