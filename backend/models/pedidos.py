from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ProdutoPedido(BaseModel):
    id_produto: int
    quantidade: int
    adicionais: List[str]
    preco: float
    tamanho: str

class RealizarPedido(BaseModel):
    produtos: Optional[List[ProdutoPedido]]

class ProdutoPedidoResponse(BaseModel):
    id_produto: int
    nome_produto: str
    quantidade: int
    preco: float
    tamanho: str
    adicionais: Optional[List[str]]

class PedidoResponse(BaseModel):
    id: int
    id_usuario: int
    nome_usuario: str
    produtos: List[ProdutoPedidoResponse]
    horario_pedido: datetime
    total: float

class PayloadPix(BaseModel):
    payload: str