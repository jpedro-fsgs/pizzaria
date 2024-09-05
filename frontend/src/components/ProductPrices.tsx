import React, { useEffect } from "react";
import { Price, Product } from "./types/product";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function ProductPrices({ produto, preco, setPreco, tamanho, setTamanho }: { produto: Product; preco: number; setPreco: Function; tamanho: string; setTamanho: Function }) {
  const handleOnChange = (value: string) => {
    setPreco(produto.preco[Number(value)].preco);
    setTamanho(produto.preco[Number(value)].tamanho);
  };
  useEffect(() => {
    if (produto.preco.length === 1) {
      setPreco(Number(produto.preco[0].preco));
      return;
    }
    setPreco(0);
  }, []);
  return (
    <RadioGroup className="flex" onValueChange={handleOnChange}>
      {produto.preco.length > 1 &&
        produto.preco.map((preco, index) => {
          return (
            <div key={index} className="flex items-center space-x-1">
              <RadioGroupItem value={index.toString()} id={preco.tamanho} />
              <Label className="cursor-pointer" htmlFor={preco.tamanho}>
                {preco.tamanho}
              </Label>
            </div>
          );
        })}
    </RadioGroup>
  );
}

export default ProductPrices;
