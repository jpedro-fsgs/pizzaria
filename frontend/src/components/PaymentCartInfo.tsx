import { useContext } from "react";
import { CartContext } from "@/CartContext";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const PaymentCartInfo = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Header must be used within a CartProvider");
  }

  const { cart, cartSize, cartTotal, clearCart, editItem, removeItem } = cartContext;

  const handleCleanCart = () => {
    clearCart();
  };

  return (
    <div className="flex w-1/4 min-h-full px-2 py-5">
      <Separator className="bg-primary h-full" orientation="vertical" />
      <div className="mx-4 my-auto space-y-14 ">
        <h2 className="text-3xl text-left">Total:</h2>
        <h2 className="text-2xl text-center">R$ {cartTotal.toFixed(2)}</h2>
        <Button className="text-secondary btn-wide" disabled={cartSize < 1}>Realizar Pedido</Button>
      </div>
    </div>
  );
};

export default PaymentCartInfo;
