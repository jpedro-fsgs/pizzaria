// CartContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Product } from "./components/types/product";


// Define o tipo do contexto do carrinho
interface CartContextType {
  cart: Product[];
  addItem: (product: Product) => void;
  editItem: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}



export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Product) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.id === product.id);
      if (itemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[itemIndex].quantidade += product.quantidade;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
  };

  const editItem = (id: number, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return <CartContext.Provider value={{ cart, addItem, editItem, removeItem, clearCart }}>{children}</CartContext.Provider>;
};
