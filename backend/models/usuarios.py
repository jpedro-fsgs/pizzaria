from typing import Dict
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
    token: dict
