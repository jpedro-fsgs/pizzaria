import { CartContext } from "@/CartContext";
import PaymentCartInfo from "@/components/PaymentCartInfo";
import PaymentCartTable from "@/components/PaymentCartTable";
import { ProductCart } from "@/components/types/product";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";

const Payment = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Header must be used within a CartProvider");
  }

  const { cart, cartSize, clearCart, editItem, removeItem } = cartContext;

  const handleCleanCart = () => {
    clearCart();
  };

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

  const handleFinalizarPedido = () => {};

  const total = cart.reduce((acc, product) => acc + product.preco * product.quantidade, 0); // Cálculo do total

  return (
    <main className="flex gap-5 p-2 min-h-[75vh]">
        {cartSize > 0 ? <PaymentCartTable /> : <h2 className="w-full text-center mt-36">Não há itens</h2>}
        <PaymentCartInfo />
    </main>
  );
};

export default Payment;
