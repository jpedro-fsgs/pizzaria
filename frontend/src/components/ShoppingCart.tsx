import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductCart } from "./types/product";
import { useContext } from "react";
import { CartContext } from "@/CartContext";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Header must be used within a CartProvider");
  }

  const { cart, cartSize, cartTotal, clearCart, editItem, removeItem } = cartContext;
  const products = cart;

  const handleCleanCart = () => {
    clearCart();
  }

  const plusItem = (product: ProductCart) => {
    editItem(product, product.quantidade + 1);
  }

  const minusItem = (product: ProductCart) => {
    if(product.quantidade > 1){
      editItem(product, product.quantidade - 1);
      return;
    }
    removeItem(product);
  }

  const navigate = useNavigate();
  const handleFinalizarPedido = () => {
    navigate("/payment")
  }
  
  const handleSimulateToRenderItems = (products: ProductCart[]) => {
    return products.map((product, i) => (
      <div key={i} className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{product.nome}</p>
          <p className="italic">{product.tamanho}</p>
          <ul className="list-disc list-inside text-xs">
            {product.adicionais.length > 0 &&
              product.adicionais.map((adicional, index) => {
                return <li key={index}>{adicional}</li>;
              })}
          </ul>
          <p>R$ {(product.preco * product.quantidade).toFixed(2)}</p> {/* Formatação do preço */}
        </div>
        <div className="flex outline outline-base-300 outline-1 rounded-md w-20 p-1 justify-between items-center">
          <button onClick={() => minusItem(product)} className="btn btn-circle btn-ghost btn-xs p-0">{product.quantidade > 1 ? <Minus size={20}/> : <Trash2 size={15} />}</button>
          <p className="text-lg text-center">{product.quantidade}</p>
          <button onClick={() => plusItem(product)} className="btn btn-circle btn-ghost btn-xs p-0">
            <Plus size={20} />
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div tabIndex={0} className="w-72 translate-x-16 card card-compact dropdown-content bg-base-100 z-[1] mt-3 shadow max-h-[80vh] overflow-y-auto">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">{cartSize === 0 ? `Não há itens` : products.length === 1 ? `${cartSize} Item` : `${cartSize} Itens`}</span>
          <button onClick={handleCleanCart} className="btn btn-ghost btn-sm text-primary">Limpar</button>
        </div>
        {handleSimulateToRenderItems(products)}
        <span className="text-info font-bold">Total: R$ {cartTotal.toFixed(2)}</span> {/* Usando o total calculado */}
        <div className="card-actions">
          <button onClick={handleFinalizarPedido} className="btn btn-primary btn-block" disabled={cartSize === 0} >Finalizar pedido</button>
        </div>
      </div>
    </div>
  );
}
