import React from "react";
import { Price, Product } from "./types/product";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function ProductPrices({ produto, selectedPreco, setSelectedPreco }: { produto: Product; selectedPreco: any; setSelectedPreco: any }) {
    const precos = [...produto.preco].sort((a, b) => a.preco - b.preco);
    
    const handleOnChange = (value: string) => {
        setSelectedPreco(Number(value))
    }
    
    return (
    <RadioGroup className="flex" defaultValue={String(selectedPreco)} onValueChange={handleOnChange}>
      {precos.length > 1 && precos.map((preco, index) => {
        return (
          <div key={index} className="flex items-center space-x-1">
            <RadioGroupItem value={String(preco.preco)} id={preco.tamanho} />
            <Label className="cursor-pointer" htmlFor={preco.tamanho}>{preco.tamanho}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

export default ProductPrices;
