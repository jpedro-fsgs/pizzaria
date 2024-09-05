export interface Price {
  tamanho: string;
  preco: number;
}

export interface Additional {
  nome: string;
  preco: number;
}

// Define o tipo para um produto
export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: Array<Price>;
  url_imagens: string[];
  adicionais: Array<Additional>;
  id_categoria: number;
  quantidade: number;
}

export interface ProductCart {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  tamanho: string;
  url_imagens: string[];
  adicionais: string[];
  id_categoria: number;
  quantidade: number;
}

export type Categoria = {
  id: number;
  nome: string;
  produtos: Product[];
};
