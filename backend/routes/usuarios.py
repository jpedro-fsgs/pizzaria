from datetime import timedelta
from typing import Annotated

from app.security import get_hashed_senha, criar_token_acesso
from database.schema import Usuario, get_session, Session
from fastapi import APIRouter, Depends, HTTPException, status
from models import CadastroUsuario, UsuarioResponse, UsuarioResponseToken
from sqlalchemy.orm.attributes import flag_modified

from models.usuarios import Endereco, UpdateEndereco, UpdateUsuario
from routes.auth import get_current_usuario


router = APIRouter()


@router.get("/atual/", response_model=UsuarioResponse)
async def get_usuario_atual(
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    usuario = session.query(Usuario).get(user["id"])
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    
    return UsuarioResponse(
        id=usuario.id,
        nome=usuario.nome,
        telefone=usuario.telefone,
        endereco=usuario.endereco,
        email=usuario.email,
        adm=usuario.adm
    )


@router.post("/cadastrar/", response_model=UsuarioResponseToken)
async def cadastrar_usuario(
    usuario_input: CadastroUsuario, session: Session = Depends(get_session)
):
    if session.query(Usuario).filter(Usuario.email == usuario_input.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email já cadastrado")

    usuario = Usuario(
        nome=usuario_input.nome,
        telefone=usuario_input.telefone,
        endereco=usuario_input.endereco.model_dump(),
        email=usuario_input.email,
        hashed_senha=get_hashed_senha(usuario_input.senha),
    )
    session.add(usuario)
    session.commit()

    # Gerar o token após o usuário ser salvo com sucesso
    token = criar_token_acesso(
        usuario.email, usuario.id, usuario.adm, timedelta(minutes=20)
    )

    return UsuarioResponseToken(
        id=usuario.id,
        nome=usuario.nome,
        telefone=usuario.telefone,
        endereco=usuario.endereco,
        email=usuario.email,
        adm=usuario.adm,
        access_token=token,
        token_type="bearer"
    )

@router.put("/editar/", response_model=UsuarioResponse)
async def editar_usuario(
    usuario_update: UpdateUsuario,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    
    if usuario_update.email and session.query(Usuario).filter(Usuario.email == usuario_update.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email já cadastrado")

    usuario = session.query(Usuario).get(user["id"])
    
    if usuario_update.nome:
        usuario.nome = usuario_update.nome
    if usuario_update.telefone:
        usuario.telefone = usuario_update.telefone
    if usuario_update.email:
        usuario.email = usuario_update.email
    if usuario_update.senha:
        usuario.hashed_senha = get_hashed_senha(usuario_update.senha)

    session.add(usuario)
    session.commit()

    return UsuarioResponse(
        id=usuario.id,
        nome=usuario.nome,
        telefone=usuario.telefone,
        endereco=usuario.endereco,
        email=usuario.email,
        adm=usuario.adm
    )

@router.put("/editar-endereco/", response_model=Endereco)
async def editar_endereco(
    endereco_update: UpdateEndereco,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    usuario = session.query(Usuario).get(user["id"])

    endereco = usuario.endereco

    campos = ['rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep']

    for campo in campos:
        valor = getattr(endereco_update, campo)
        if valor:
           endereco[campo] = valor

    usuario.endereco = endereco

    flag_modified(usuario, "endereco")
    session.add(usuario)

    session.commit()

    return endereco

@router.delete("/deletar/", response_model=UsuarioResponse)
async def deletar_usuario(
    id: int,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    if user["id"] != id :
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado")

    usuario = session.query(Usuario).get(id)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    
    usuario_dados = UsuarioResponse(
        id=usuario.id,
        nome=usuario.nome,
        telefone=usuario.telefone,
        endereco=usuario.endereco,
        email=usuario.email,
        adm=usuario.adm
    )
    
    session.delete(usuario)
    session.commit()

    return usuario_dados
    