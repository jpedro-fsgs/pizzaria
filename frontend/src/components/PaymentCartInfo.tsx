import { useContext, useEffect } from "react";
import { CartContext } from "@/CartContext";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { UserContext } from "@/UserContext";
import Login from "./LoginModal";
import { useMutation } from "react-query";
import LoadingIcon from "./ui/loading";
import { toast } from "sonner";
import PixModal from "./PixModal";
import { FaPix } from "react-icons/fa6";

const PaymentCartInfo = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("must be used within a CartProvider");
  }

  const { cartSize, cartTotal, realizarPedido } = cartContext;

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("must be used within a CartProvider");
  }

  const user = userContext;

  const { mutate, isLoading, error, data: pedidoAtual } = useMutation(realizarPedido);

  const handleRealizarPedido = () => {
    mutate();
  };

  useEffect(() => {
    if (error) {
      toast.error("Erro ao processar pedido");
    }
  }, [error]);

  if (pedidoAtual) {
    return (
      <div className="flex md:w-1/4 min-h-full my-4">
        <Separator className="bg-primary h-full max-md:hidden" orientation="vertical" />
        <div className="mx-auto my-auto space-y-14 ">
        <h2 className="text-3xl text-left">Total:</h2>
        <h2 className="text-2xl text-center">R$ {pedidoAtual.total.toFixed(2)}</h2>
          <PixModal pedido={pedidoAtual}>
            <a className="text-secondary bg-primary btn btn-md"><FaPix size={32} />Efetuar Pagamento</a>
          </PixModal>
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:w-1/4 min-h-full my-4">
      <Separator className="bg-primary h-full max-md:hidden" orientation="vertical" />
      <div className="mx-auto my-auto space-y-14 ">
        <h2 className="text-3xl text-left">Total:</h2>
        <h2 className="text-2xl text-center">R$ {cartTotal.toFixed(2)}</h2>
        {user.isLogged ? (
          <Button className="text-secondary btn btn-md w-40" disabled={cartSize < 1 || isLoading} onClick={handleRealizarPedido}>
            {isLoading ? <LoadingIcon /> : "Realizar Pedido"}
          </Button>
        ) : (
          <Login>
            <Button className="text-secondary btn btn-md w-40">Realizar Pedido</Button>
          </Login>
        )}
      </div>
    </div>
  );
};

export default PaymentCartInfo;
