import { CartContext } from "@/CartContext";
import PaymentCartInfo from "@/components/PaymentCartInfo";
import PaymentCartTable from "@/components/PaymentCartTable";
import { useContext } from "react";

const Payment = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Header must be used within a CartProvider");
  }

  const { cartSize } = cartContext;



  return (
    <main className="md:flex gap-5 p-2">
        {cartSize > 0 ? <PaymentCartTable /> : <h2 className="w-full text-center mt-36">Não há itens</h2>}
        <PaymentCartInfo />
    </main>
  );
};

export default Payment;
