from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter()

# Criar pagamento
@router.post("/", response_model=schemas.Pagamento)
def create_pagamento(pag: schemas.PagamentoCreate, db: Session = Depends(get_db)):

    # Verificar se a locação existe
    locacao = db.query(models.Locacao).filter(models.Locacao.id == pag.locacao_id).first()
    
    if not locacao:
        raise HTTPException(status_code=404, detail="Locação não encontrada")

    novo_pagamento = models.Pagamento(
        locacao_id=pag.locacao_id,
        valor=pag.valor,
        metodo=pag.metodo
    )

    db.add(novo_pagamento)
    db.commit()
    db.refresh(novo_pagamento)

    return novo_pagamento


# Listar pagamentos
@router.get("/", response_model=list[schemas.Pagamento])
def list_pagamentos(db: Session = Depends(get_db)):
    return db.query(models.Pagamento).all()


# Buscar pagamento por ID
@router.get("/{pagamento_id}", response_model=schemas.Pagamento)
def get_pagamento(pagamento_id: int, db: Session = Depends(get_db)):

    pagamento = db.query(models.Pagamento).filter(models.Pagamento.id == pagamento_id).first()

    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")

    return pagamento


# Atualizar pagamento
@router.put("/{pagamento_id}", response_model=schemas.Pagamento)
def update_pagamento(pagamento_id: int, dados: schemas.PagamentoCreate, db: Session = Depends(get_db)):

    pagamento = db.query(models.Pagamento).filter(models.Pagamento.id == pagamento_id).first()

    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")

    # Verificar se a locação existe
    locacao = db.query(models.Locacao).filter(models.Locacao.id == dados.locacao_id).first()
    if not locacao:
        raise HTTPException(status_code=404, detail="Locação não encontrada")

    pagamento.locacao_id = dados.locacao_id
    pagamento.valor = dados.valor
    pagamento.metodo = dados.metodo

    db.commit()
    db.refresh(pagamento)

    return pagamento


# Deletar pagamento
@router.delete("/{pagamento_id}")
def delete_pagamento(pagamento_id: int, db: Session = Depends(get_db)):

    pagamento = db.query(models.Pagamento).filter(models.Pagamento.id == pagamento_id).first()

    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")

    db.delete(pagamento)
    db.commit()

    return {"detail": "Pagamento removido com sucesso"}
