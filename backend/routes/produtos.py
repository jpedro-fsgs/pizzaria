from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from models.produtos import CadastrarProduto, ProdutoResponse
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
    """
    Recupera todos os produtos cadastrados.

    - **Retorna** uma lista de produtos com suas informações (id, nome, descrição, preço, imagem, categoria).
    """
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
        # Busca o produto pelo ID
        produto = session.query(Produto).get(produto_input.id)

        if not produto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado."
            )

        # Atualiza os campos do produto
        produto.nome = produto_input.nome
        produto.descricao = produto_input.descricao
        produto.preco = produto_input.preco
        produto.url_imagem = produto_input.url_imagem
        produto.id_categoria = produto_input.id_categoria

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
        raise HTTPException(status_code=500, detail=f"Erro ao editar produto: {str(e)}")
