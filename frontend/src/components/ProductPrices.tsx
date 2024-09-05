import React from "react";
import { Price, Product } from "./types/product";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function ProductPrices({ produto, preco, setPreco }: { produto: Product; preco: number; setPreco: Function }) {

  const handleOnChange = (value: string) => {
    setPreco(Number(value));
  };
  return (
    <RadioGroup className="flex" defaultValue={String(preco)} onValueChange={handleOnChange}>
      {produto.preco.length > 1 &&
        produto.preco.map((preco, index) => {
          return (
            <div key={index} className="flex items-center space-x-1">
              <RadioGroupItem value={String(preco.preco)} id={preco.tamanho} />
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
