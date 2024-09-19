from typing import Annotated
from database.schema import Pedido, PedidoProduto, Usuario, get_session, Session
from fastapi import APIRouter, Depends, HTTPException, status
from models import UsuarioResponse

from models.pedidos import PedidoResponse, ProdutoPedidoResponse
from routes.auth import get_current_usuario

router = APIRouter()


@router.get("/", response_model=list[UsuarioResponse])
async def get_administradores(
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado"
        )

    administradores = session.query(Usuario).filter(Usuario.adm).all()
    return [
        UsuarioResponse(
            id=adm.id,
            nome=adm.nome,
            telefone=adm.telefone,
            endereco=adm.endereco,
            email=adm.email,
            adm=True,
        )
        for adm in administradores
    ]


@router.get("/usuarios/", response_model=list[UsuarioResponse])
async def get_usuarios(
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado"
        )

    usuarios = session.query(Usuario).all()
    return [
        UsuarioResponse(
            id=usuario.id,
            nome=usuario.nome,
            telefone=usuario.telefone,
            endereco=usuario.endereco,
            email=usuario.email,
            adm=usuario.adm,
        )
        for usuario in usuarios
    ]


@router.get("/pedidos/", response_model=list[PedidoResponse])
async def get_pedidos(
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado"
        )

    pedidos = session.query(Pedido).all()
    pedido_produtos = session.query(PedidoProduto)

    pedido_response = []
    for pedido in pedidos:
        produtos = []
        for produto in pedido.produtos:

            produto_pedido = (
                pedido_produtos.filter(PedidoProduto.pedido_id == pedido.id)
                .filter(PedidoProduto.produto_id == produto.id)
                .first()
            )

            produtos.append(
                ProdutoPedidoResponse(
                    id_produto=produto.id,
                    nome_produto=produto.nome,
                    quantidade=produto_pedido.quantidade,
                    preco=produto_pedido.preco_total,
                    adicionais=produto_pedido.adicionais_pedido,
                    tamanho=produto_pedido.tamanho,
                )
            )
        pedido_response.append(
            PedidoResponse(
                id=pedido.id,
                id_usuario=pedido.id_usuario,
                nome_usuario=pedido.usuario.nome,
                produtos=produtos,
                horario_pedido=pedido.horario_pedido,
                total=pedido.total,
            )
        )

    return pedido_response


@router.post("/set-adm/{id}/")
async def set_administrador(
    id: int,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado"
        )
    
    adm = session.query(Usuario).get(id)

    if adm.adm:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Usuário já é administrador")
    
    adm.adm = True
    session.commit()

    return UsuarioResponse(
        id=adm.id,
        nome=adm.nome,
        telefone=adm.telefone,
        endereco=adm.endereco,
        email=adm.email,
        adm=adm.adm,
    )
