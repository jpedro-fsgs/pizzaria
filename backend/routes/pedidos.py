import logging
import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc

from database.schema import (
    Pedido,
    PedidoProduto,
    Produto,
    get_session,
    Session,
)
from models import PedidoResponse, ProdutoPedidoResponse, RealizarPedido

from app.pix import Payload
from routes.auth import get_current_usuario

# Definição chave de pix
CHAVE_PIX = os.environ.get("CHAVE_PIX")
# Verificação da validade da chave PIX
# CHAVE_PIX = os.environ.get("CHAVE_PIX")

if not CHAVE_PIX:
    raise ValueError("A chave PIX não foi configurada. Verifique o arquivo.env.")


# Verificação da validade da chave PIX

# Criar pasta de logs se não existir


logger = logging.getLogger(__name__)

router = APIRouter()


# def send_whatsapp_notification(phone_number: str, message: str, background_tasks: BackgroundTasks) -> None:
#     background_tasks.add_task(pywhatkit.sendwhatmsg_instantly, phone_number, message, 7, True, 2)


@router.get("/")
async def get_pedidos(session: Session = Depends(get_session)):
    try:
        pedidos = session.query(Pedido).all()
        pedido_produtos = session.query(PedidoProduto)

        pedido_response = []
        for pedido in pedidos:
            produtos = []
            for produto in pedido.produtos:

                produto_pedido = (
                    pedido_produtos
                    .filter(PedidoProduto.pedido_id == pedido.id)
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

    except Exception as e:
        logger.error(f"Erro buscando pedidos: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        session.close()


@router.get("/usuario/")
async def get_pedidos_usuario(
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    try:
        pedidos = session.query(Pedido).filter(Pedido.id_usuario == user["id"]).order_by(desc(Pedido.horario_pedido)).all()
        pedido_produtos = session.query(PedidoProduto)

        pedido_response = []
        for pedido in pedidos:
            produtos = []
            for produto in pedido.produtos:

                produto_pedido = (
                    pedido_produtos
                    .filter(PedidoProduto.pedido_id == pedido.id)
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
    
    except Exception as e:
        logger.error(f"Erro buscando pedidos: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        session.close()


@router.post("/cadastrar/")
async def cadastrar_pedido(
    pedido_input: RealizarPedido,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    try:
        pedido = Pedido(id_usuario=user["id"], total=0)
        session.add(pedido)
        session.flush()
        produtos = []
        total = 0

        for produto_input in pedido_input.produtos:
            produto = session.query(Produto).get(produto_input.id_produto)

            if not produto:
                raise HTTPException(status_code=404, detail="Produto não encontrado")

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


        # Enviar notificações por e-mail e WhatsApp em background
        # send_whatsapp_notification(usuario.telefone, "Seu pedido foi cadastrado com sucesso!", background_tasks)

        logger.info(
            f"Pedido {pedido.id} cadastrado com sucesso para o usuário {pedido.id_usuario}."
        )

        produtos = []
        for produto in pedido.produtos:
            pedido_produtos = session.query(PedidoProduto)
            produto_pedido = (
                pedido_produtos
                .filter(PedidoProduto.pedido_id == pedido.id)
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

        return PedidoResponse(
            id=pedido.id,
            id_usuario=pedido.id_usuario,
            nome_usuario=pedido.usuario.nome,
            produtos=produtos,
            horario_pedido=pedido.horario_pedido,
            total=pedido.total,
        )
        
    except Exception as e:
        logger.error(f"Erro cadastrando ordem: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        session.close()


@router.get("/pix/{pedido_id}/")
async def gerar_pix(pedido_id: int, session: Session = Depends(get_session)):
    pedido = session.query(Pedido).get(pedido_id)

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    payload_pix = Payload(CHAVE_PIX, pedido.total).gerarPayload()

    return {"payload": payload_pix}
