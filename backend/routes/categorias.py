from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.categorias import (
    CadastrarCategoria,
    CategoriaResponse,
    EditarCategoria,
    ProdutoCategoria,
)
from database.schema import Categoria, get_session, Session
from routes.auth import get_current_usuario

router = APIRouter()


@router.get("/", response_model=list[CategoriaResponse])
async def get_categorias(session: Session = Depends(get_session)):
    try:
        categorias = session.query(Categoria).all()
        return [
            CategoriaResponse(
                id=categoria.id,
                nome=categoria.nome,
                produtos=[
                    ProdutoCategoria(
                        id=produto.id,
                        nome=produto.nome,
                        descricao=produto.descricao,
                        preco=produto.preco,
                        url_imagens=produto.url_imagens,
                        adicionais=produto.adicionais,
                    )
                    for produto in categoria.produtos
                ],
            )
            for categoria in categorias
        ]
    except Exception as e:
        logger.error(f"Erro ao buscar categorias: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar categorias.",
        )


@router.post("/cadastrar/", response_model=CategoriaResponse)
async def cadastrar_categoria(
    categoria_input: CadastrarCategoria,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado"
        )

    try:
        categoria = Categoria(nome=categoria_input.nome)
        session.add(categoria)
        session.commit()
        return CategoriaResponse(id=categoria.id, nome=categoria.nome, produtos=[])

    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Categoria já cadastrada."
        )


@router.put("/editar/", response_model=CategoriaResponse)
async def editar_categoria(
    categoria_update: EditarCategoria,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado"
        )

    categoria = (
        session.query(Categoria).get(categoria_update.id)
    )

    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoria não encontrada"
        )

    if categoria_update.nome:
        categoria.nome = categoria_update.nome

    session.commit()

    return CategoriaResponse(
        id=categoria.id,
        nome=categoria.nome,
        produtos=[
            ProdutoCategoria(
                id=produto.id,
                nome=produto.nome,
                descricao=produto.descricao,
                preco=produto.preco,
                url_imagens=produto.url_imagens,
                adicionais=produto.adicionais,
            )
            for produto in categoria.produtos
        ],
    )


@router.delete("/deletar/{id}", response_model=CategoriaResponse)
async def deletar_categoria(
    id: int,
    user: Annotated[dict, Depends(get_current_usuario)],
    session: Session = Depends(get_session),
):
    if not user["is_adm"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado"
        )

    categoria = session.query(Categoria).get(id)

    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoria não encontrada"
        )

    categoria_dados = CategoriaResponse(
        id=categoria.id,
        nome=categoria.nome,
        produtos=[
            ProdutoCategoria(
                id=produto.id,
                nome=produto.nome,
                descricao=produto.descricao,
                preco=produto.preco,
                url_imagens=produto.url_imagens,
                adicionais=produto.adicionais,
            )
            for produto in categoria.produtos
        ],
    )

    session.delete(categoria)
    session.commit()

    return categoria_dados
