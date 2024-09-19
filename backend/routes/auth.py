import logging
from datetime import timedelta
from typing import Annotated

import jwt

from app.security import autenticar_usuario, criar_token_acesso
from database.schema import Session, Usuario, get_session
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.security import verifica_token_acesso
from models.usuarios import UsuarioResponseToken

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token/")

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/token/")
async def login_for_acess_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                session: Session = Depends(get_session)):
    
    
    usuario = session.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not usuario:
        logger.warning(f"Tentativa de login com email inexistente: {form_data.username}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não foi possível validar o usuário")

    # Verifica a senha antes de autentificar
    if not autenticar_usuario(usuario, form_data.password):
        logger.warning(f"Tentativa de login com senha incorreta para usuário: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )


    token = criar_token_acesso(usuario.email, usuario.id, usuario.adm, timedelta(minutes=200))
    # token = criar_token_acesso(usuario.email, usuario.id, usuario.adm, timedelta(minutes=20))


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



async def get_current_usuario(token: Annotated[str, Depends(oauth2_scheme)]):
    
    try:
        payload = verifica_token_acesso(token)
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        is_adm: bool = payload.get('is_adm', False)
        if not username or not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não foi possível validar o usuário")

        return {'username': username, 'id': user_id, 'is_adm': is_adm }

    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado")