import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc

from app.email import criar_email, send_email
from database.schema import (
    Pedido,
    PedidoProduto,
    Produto,
    get_session,
    Session,
)
from models import PedidoResponse, ProdutoPedidoResponse, RealizarPedido

from app.pix import Payload
from models.pedidos import PayloadPix
from routes.auth import get_current_usuario

# Definição chave de pix
CHAVE_PIX = os.environ.get("CHAVE_PIX")
NOME_PIX = os.environ.get("NOME_PIX")
CIDADE_PIX = os.environ.get("CIDADE_PIX")
ID_PIX = os.environ.get("ID_PIX")

# Verificação da validade da chave PIX
if not CHAVE_PIX:
    raise ValueError("A chave PIX não foi configurada. Verifique o arquivo.env.")


# Verificação da validade da chave PIX

# Criar pasta de logs se não existir

router = APIRouter()


@router.get("/usuario/", response_model=list[PedidoResponse])
async def get_pedidos_usuario(
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    pedidos = (
        session.query(Pedido)
        .filter(Pedido.id_usuario == user["id"])
        .order_by(desc(Pedido.horario_pedido))
        .all()
    )
    pedido_produtos = session.query(PedidoProduto)

    pedido_response = []
    for pedido in pedidos:
        produtos = []
        for produto in pedido.produtos:

            produtos_pedido = (
                pedido_produtos.filter(PedidoProduto.pedido_id == pedido.id)
                .filter(PedidoProduto.produto_id == produto.id)
                .all()
            )

            for produto_pedido in produtos_pedido:
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


@router.get("/{pedido_id}/", response_model=PedidoResponse)
async def get_pedido(
    pedido_id: int,
    # user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    pedido = session.query(Pedido).get(pedido_id)
    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado"
        )

    produtos = []
    for produto in pedido.produtos:
        pedido_produtos = session.query(PedidoProduto)
        produtos_pedido = (
            pedido_produtos.filter(PedidoProduto.pedido_id == pedido.id)
            .filter(PedidoProduto.produto_id == produto.id)
            .all()
        )
        for produto_pedido in produtos_pedido:
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

    return PedidoResponse(
        id=pedido.id,
        id_usuario=pedido.id_usuario,
        nome_usuario=pedido.usuario.nome,
        produtos=produtos,
        horario_pedido=pedido.horario_pedido,
        total=pedido.total,
    )


@router.post("/cadastrar/", response_model=PedidoResponse)
async def cadastrar_pedido(
    pedido_input: RealizarPedido,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):

    pedido = Pedido(id_usuario=user["id"], total=0)
    session.add(pedido)
    session.flush()
    produtos = []
    total = 0

    for produto_input in pedido_input.produtos:
        produto = session.query(Produto).get(produto_input.id_produto)

        if not produto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
            )

        produtos.append(produto)
        total += produto_input.preco * produto_input.quantidade
        session.add(
            PedidoProduto(
                pedido_id=pedido.id,
                adicionais_pedido=produto_input.adicionais,
                produto_id=produto.id,
                tamanho=produto_input.tamanho,
                quantidade=produto_input.quantidade,
                preco_total=produto_input.preco * produto_input.quantidade,
            )
        )

    pedido.total = total
    session.add(pedido)
    session.commit()

    produtos = []
    for produto in pedido.produtos:
        pedido_produtos = session.query(PedidoProduto)
        produtos_pedido = (
            pedido_produtos.filter(PedidoProduto.pedido_id == pedido.id)
            .filter(PedidoProduto.produto_id == produto.id)
            .all()
        )
        for produto_pedido in produtos_pedido:
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

    return PedidoResponse(
        id=pedido.id,
        id_usuario=pedido.id_usuario,
        nome_usuario=pedido.usuario.nome,
        produtos=produtos,
        horario_pedido=pedido.horario_pedido,
        total=pedido.total,
    )


@router.get("/pix/{pedido_id}/", response_model=PayloadPix)
async def gerar_pix(pedido_id: int, session: Session = Depends(get_session)):
    pedido = session.query(Pedido).get(pedido_id)

    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado"
        )

    payload_pix = Payload(CHAVE_PIX, ID_PIX, pedido.total, NOME_PIX, CIDADE_PIX).gerarPayload()

    return PayloadPix(payload=payload_pix)


@router.post("/email/{pedido_id}/")
async def enviar_email(
    pedido_id: int,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    pedido = session.query(Pedido).get(pedido_id)

    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if pedido.usuario.id != user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    subject = f"Pizzaria Borcelle: Pedido n°{pedido.id} confirmado"
    body = criar_email(
        await get_pedido(pedido.id, session), await gerar_pix(pedido.id, session)
    )
    to = pedido.usuario.email
    fallback = f"Pizzaria Borcelle: Pedido n°{pedido.id} de {pedido.usuario.nome} foi confirmado"

    response = await send_email(subject, body, to, fallback)

    return {
        "message": f"E-mail enviado para {pedido.usuario.email}",
        "response": response,
    }