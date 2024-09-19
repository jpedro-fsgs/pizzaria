from datetime import timedelta
from typing import Annotated

from app.security import get_hashed_senha, criar_token_acesso
from database.schema import Usuario, get_session, Session
from fastapi import APIRouter, Depends, HTTPException
from models import CadastroUsuario, UsuarioResponse, UsuarioResponseToken
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from models.usuarios import Token
from routes.auth import get_current_usuario


router = APIRouter()


@router.get("/")
async def get_usuarios(session: Session = Depends(get_session)):
    usuarios = session.query(Usuario).all()
    print(usuarios[0].endereco)
    return [
        UsuarioResponse(
            id=usuario.id,
            nome=usuario.nome,
            telefone=usuario.telefone,
            endereco=usuario.endereco,
            email=usuario.email,
            adm=usuario.adm
        )
        for usuario in usuarios
    ]


@router.get("/atual/")
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
    try:
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
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email já cadastrado")
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        session.close()

    return UsuarioResponseToken(
        id=usuario.id,
        nome=usuario.nome,
        telefone=usuario.telefone,
        endereco=usuario.endereco,
        email=usuario.email,
        adm=usuario.adm,
        token=Token(access_token=token, token_type="bearer")
    )
