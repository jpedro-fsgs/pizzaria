from typing import Optional
from pydantic import BaseModel


class Endereco(BaseModel):
    rua: str
    numero: int
    complemento: str
    cidade: str
    estado: str
    cep: str

class CadastroUsuario(BaseModel):
    nome: str
    telefone: str
    endereco: Endereco
    email: str
    senha: str

class UpdateUsuario(BaseModel):
    nome: Optional[str]
    telefone: Optional[str]
    endereco: Optional[Endereco]
    email: Optional[str]
    senha: Optional[str]


class UsuarioResponse(BaseModel):
    id: int
    nome: str
    telefone: str
    endereco: Endereco
    email: str
    adm: bool

class UsuarioResponseToken(BaseModel):
    id: int
    nome: str
    telefone: str
    endereco: Endereco
    email: str
    adm: bool
    access_token: str
    token_type: str