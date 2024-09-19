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

class EditarProduto(BaseModel):
    nome: Optional[str]
    descricao: Optional[str]
    remover_precos: List[str]
    precos: Optional[List[TamanhoPreco]]
    remover_imagens: List[str]
    url_imagens: Optional[List[str]]
    remover_adicionais: List[str]
    adicionais: Optional[List[Adicional]]
    id_categoria: Optional[int]

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    precos: List[TamanhoPreco]
    url_imagens: List[str]
    adicionais: List[Adicional]
    id_categoria: int
    categoria: str