from typing import List, Optional
from pydantic import BaseModel

from models.produtos import Adicional, TamanhoPreco

class ProdutoCategoria(BaseModel):
    id: int
    nome: str
    descricao: str
    preco: List[TamanhoPreco]
    url_imagens: List[str]
    adicionais: List[Adicional]


class CadastrarCategoria(BaseModel):
    nome: str

class CategoriaResponse(BaseModel):
    id: int
    nome: str
    produtos: List[ProdutoCategoria]