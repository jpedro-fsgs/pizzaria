import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Product } from "./types/product";

function ProductAdditionals({ produto }: { produto: Product }) {
  return (
    <>
      <h2>Selecione os adicionais: </h2>
      <ToggleGroup type="multiple" className="">
        {produto.adicionais.map((adicional) => {
          return <ToggleGroupItem className="outline outline-1" value={adicional.nome}>{adicional.nome}</ToggleGroupItem>;
        })}
      </ToggleGroup>
    </>
  );
}

export default ProductAdditionals;
