from typing import Dict, List, Optional
from pydantic import BaseModel

class Adicional(BaseModel):
    nome: str
    preco: float

class TamanhoPreco(BaseModel):
    tamanho: str
    preco: float

class CadastrarProduto(BaseModel):
    nome: str
    descricao: str
    precos: List[TamanhoPreco]
    url_imagens: List[str]
    adicionais: List[Adicional]
    id_categoria: int

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    precos: List[TamanhoPreco]
    url_imagens: List[str]
    adicionais: List[Adicional]
    id_categoria: int
    categoria: str