import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Product } from "./types/product";

function ProductAdditionals({ produto, setPrecoAdicionais }: { produto: Product; setPrecoAdicionais: Function }) {
  
    const handleOnValueChange = (value: string[]) => {
        const sum = value.reduce((sum, currentValue) => {
            return sum + Number(currentValue);
        }, 0);
        setPrecoAdicionais(sum);
    }

    return (
    <>
      <h2>Selecione os adicionais: </h2>
      <ToggleGroup type="multiple" className="space-x-1" variant="outline" onValueChange={handleOnValueChange}>
        {produto.adicionais.map((adicional, index) => {
          return (
            <ToggleGroupItem className="bg-base-200" key={index} value={String(adicional.preco)}>
              {adicional.nome} R$ {adicional.preco.toFixed(2)}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </>
  );
}

export default ProductAdditionals;
