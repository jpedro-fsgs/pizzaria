import { Product } from "./types/product";

interface ShoppingCartProps {
  products: Product[];
}

export default function ShoppingCart({ products }: ShoppingCartProps) {
  const handleSimulateToRenderItems = (products: Product[]) => {
    return products.map((product, i) => (
      <div key={i} className="flex justify-between">
        <div>
          <p>{product.nome}</p>
          {product.adicionais && <p>{product.adicionais[0].nome}</p>}
          <p>{product.preco.toFixed(2)} $</p> {/* Formatação do preço */}
        </div>
      </div>
    ));
  };

  const total = products.reduce((acc, product) => acc + product.preco[0].preco, 0).toFixed(2); // Cálculo do total

  return (
    <div tabIndex={0} className="w-64 translate-x-10 card card-compact dropdown-content bg-base-100 z-[1] mt-3 shadow overflow-y-auto">
      <div className="card-body">
        <span className="text-lg font-bold">{products.length} Itens</span>
        {handleSimulateToRenderItems(products)}
        <span className="text-info">Total: ${total}</span> {/* Usando o total calculado */}
        <div className="card-actions">
          <button className="btn btn-primary btn-block">Finalizar pedido</button>
        </div>
      </div>
    </div>
  );
}
