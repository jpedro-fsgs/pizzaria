from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from models.produtos import CadastrarProduto, EditarProduto, ProdutoResponse
from database.schema import Produto, get_session, Session, Categoria
from routes.auth import get_current_usuario

router = APIRouter()

from fastapi import Depends, HTTPException, status


import logging

logger = logging.getLogger(__name__)


@router.get("/", response_model=list[ProdutoResponse])
async def get_produtos(
    session: Session = Depends(get_session),
) -> list[ProdutoResponse]:

    produtos = session.query(Produto).all()
    return [
        ProdutoResponse(
            id=produto.id,
            nome=produto.nome,
            descricao=produto.descricao,
            precos=produto.preco,
            url_imagens=produto.url_imagens,
            adicionais=produto.adicionais,
            id_categoria=produto.id_categoria,
            categoria=produto.categoria.nome,
        )
        for produto in produtos
    ]


@router.post("/cadastrar/", response_model=ProdutoResponse)
async def cadastrar_produto(
    produto_input: CadastrarProduto,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
) -> ProdutoResponse:

    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Usuário sem permissão."
        )

    if (
        not session.query(Categoria)
        .filter(Categoria.id == produto_input.id_categoria)
        .first()
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoria não existe."
        )

    try:
        # Criar o produto
        produto = Produto(
            nome=produto_input.nome,
            descricao=produto_input.descricao,
            preco=[preco.model_dump() for preco in produto_input.precos],
            url_imagens=produto_input.url_imagens,
            adicionais=[
                adicional.model_dump() for adicional in produto_input.adicionais
            ],
            id_categoria=produto_input.id_categoria,
        )

        session.add(produto)
        session.commit()
        return ProdutoResponse(
            id=produto.id,
            nome=produto.nome,
            descricao=produto.descricao,
            precos=produto.preco,
            url_imagens=produto.url_imagens,
            adicionais=produto.adicionais,
            id_categoria=produto.id_categoria,
            categoria=produto.categoria.nome,
        )

    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Produto já cadastrado."
        )
    except Exception as e:
        session.rollback()
        logger.error(f"Erro ao cadastrar produto: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao cadastrar produto.",
        )


@router.put("/editar/", response_model=ProdutoResponse)
async def editar_produto(
    produto_update: EditarProduto,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
) -> ProdutoResponse:

    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Usuário sem permissão."
        )

    if (
        not session.query(Categoria)
        .filter(Categoria.id == produto_update.id_categoria)
        .first()
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoria não existe."
        )

    try:
        # Busca o produto pelo ID
        produto = session.query(Produto).get(produto_update.id)

        if not produto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado."
            )

        # Atualiza os campos do produto
        if produto_update.nome:
            produto.nome = produto_update.nome
        if produto_update.descricao:
            produto.descricao = produto_update.descricao
        if produto_update.remover_precos:
            produto.preco = [
                preco
                for preco in produto.preco
                if preco.tamanho not in produto_update.remover_precos
            ]

        if produto_update.preco:
            produto.preco += produto_update.preco

        if produto_update.remover_imagens:
            produto.url_imagens = [
                imagem
                for imagem in produto.url_imagens
                if imagem not in produto_update.remover_imagens
            ]
        if produto_update.url_imagem:
            produto.url_imagens += produto_update.url_imagens

        if produto_update.remover_adicionais:
            produto.adicionais = [
                adicional
                for adicional in produto.adicionais
                if adicional.nome not in produto_update.remover_adicionais
            ]

        if produto_update.adicionais:
            produto.adicionais += produto_update.adicionais

        if produto_update.id_categoria:
            produto.id_categoria = produto_update.id_categoria

        session.commit()

        return ProdutoResponse(
            id=produto.id,
            nome=produto.nome,
            descricao=produto.descricao,
            preco=produto.preco,
            url_imagem=produto.url_imagem,
            id_categoria=produto.id_categoria,
            categoria=produto.categoria.nome,
        )

    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Produto já cadastrado."
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao editar produto: {str(e)}",
        )


@router.delete("/deletar/{id}/", response_model=ProdutoResponse)
async def deletar_produto(
    id: int,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
) -> ProdutoResponse:

    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Usuário sem permissão."
        )

    produto = session.query(Produto).get(id)

    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado."
        )

    produto_dados = ProdutoResponse(
        id=produto.id,
        nome=produto.nome,
        descricao=produto.descricao,
        preco=produto.preco,
        url_imagem=produto.url_imagem,
        id_categoria=produto.id_categoria,
        categoria=produto.categoria.nome,
    )

    session.delete(produto)
    session.commit()

    return produto_dados
