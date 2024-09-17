// CartContext.tsx
import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { ProductCart } from "./components/types/product";
import { UserContext } from "./UserContext";
import axios from "axios";
import { Pedido } from "./components/MeusPedidosTab";
import { toast } from "sonner";

// Define o tipo do contexto do carrinho
interface CartContextType {
  cart: ProductCart[];
  cartSize: number;
  cartTotal: number;
  addItem: (product: ProductCart) => void;
  editItem: (product: ProductCart, quantity: number) => void;
  removeItem: (product: ProductCart) => void;
  clearCart: () => void;
  realizarPedido: () => Promise<Pedido>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<ProductCart[]>([]);
  const [cartSize, setCartSize] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    setCartSize(cart.reduce((acc, item) => acc + item.quantidade, 0));
    setCartTotal(cart.reduce((acc, product) => acc + product.preco * product.quantidade, 0));
    if (cart.length === 0) {
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: ProductCart) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.id === product.id && item.tamanho === product.tamanho && JSON.stringify(item.adicionais) === JSON.stringify(product.adicionais));
      if (itemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[itemIndex].quantidade += product.quantidade;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
    toast.success(`${product.nome} adicionado ao carrinho!`);
  };

  const editItem = (product: ProductCart, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === product.id && item.tamanho === product.tamanho && JSON.stringify(item.adicionais) === JSON.stringify(product.adicionais) ? { ...item, quantidade: quantity } : item)));
  };

  const removeItem = (product: ProductCart) => {
    if (cartSize === 1) {
      clearCart();
      return;
    }
    setCart((prevCart) => prevCart.filter((item) => !(item.id === product.id && item.tamanho === product.tamanho && JSON.stringify(item.adicionais) === JSON.stringify(product.adicionais))));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("must be used within a CartProvider");
  }

  const { token } = userContext;

  const realizarPedido = async () => {
    const pedido = cart.map((item) => {
      return {
        id_produto: item.id,
        quantidade: item.quantidade,
        adicionais: item.adicionais,
        preco: item.preco,
        tamanho: item.tamanho,
      };
    });
    const data = await axios.post<Pedido>(
      "http://localhost:2130/pedidos/cadastrar/",
      { produtos: pedido },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if(data.status === 200){
      clearCart();
      toast("Pedido Realizado!")
    }
    return data.data;
  };

  return <CartContext.Provider value={{ cart, addItem, editItem, removeItem, clearCart, realizarPedido, cartSize, cartTotal }}>{children}</CartContext.Provider>;
};
