from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import models, schemas
from database import get_db

router = APIRouter()

# Função que calcula número de dias (mín. 1)
def calcular_dias(data_retirada: str, data_devolucao: str) -> int:
    d1 = datetime.fromisoformat(data_retirada)
    d2 = datetime.fromisoformat(data_devolucao)
    dias = (d2 - d1).days + 1
    return max(dias, 1)

# Criar locação
@router.post("/", response_model=schemas.Locacao)
def create_locacao(loc: schemas.LocacaoCreate, db: Session = Depends(get_db)):

    cliente = db.query(models.Cliente).filter(models.Cliente.id == loc.cliente_id).first()
    veiculo = db.query(models.Veiculo).filter(models.Veiculo.id == loc.veiculo_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    dias = calcular_dias(loc.data_retirada, loc.data_devolucao)
    total = dias * veiculo.valor_diaria

    nova_locacao = models.Locacao(
        cliente_id=loc.cliente_id,
        veiculo_id=loc.veiculo_id,
        data_retirada=loc.data_retirada,
        data_devolucao=loc.data_devolucao,
        total=total
    )

    db.add(nova_locacao)
    db.commit()
    db.refresh(nova_locacao)
    return nova_locacao

# Listar locações
@router.get("/", response_model=list[schemas.Locacao])
def list_locacoes(db: Session = Depends(get_db)):
    return db.query(models.Locacao).all()

# Buscar locação por ID
@router.get("/{locacao_id}", response_model=schemas.Locacao)
def get_locacao(locacao_id: int, db: Session = Depends(get_db)):
    locacao = db.query(models.Locacao).filter(models.Locacao.id == locacao_id).first()
    if not locacao:
        raise HTTPException(status_code=404, detail="Locação não encontrada")
    return locacao

# Atualizar locação
@router.put("/{locacao_id}", response_model=schemas.Locacao)
def update_locacao(locacao_id: int, dados: schemas.LocacaoCreate, db: Session = Depends(get_db)):

    locacao = db.query(models.Locacao).filter(models.Locacao.id == locacao_id).first()
    if not locacao:
        raise HTTPException(status_code=404, detail="Locação não encontrada")

    cliente = db.query(models.Cliente).filter(models.Cliente.id == dados.cliente_id).first()
    veiculo = db.query(models.Veiculo).filter(models.Veiculo.id == dados.veiculo_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    dias = calcular_dias(dados.data_retirada, dados.data_devolucao)
    total = dias * veiculo.valor_diaria

    locacao.cliente_id = dados.cliente_id
    locacao.veiculo_id = dados.veiculo_id
    locacao.data_retirada = dados.data_retirada
    locacao.data_devolucao = dados.data_devolucao
    locacao.total = total

    db.commit()
    db.refresh(locacao)
    return locacao

# Excluir locação
@router.delete("/{locacao_id}")
def delete_locacao(locacao_id: int, db: Session = Depends(get_db)):
    locacao = db.query(models.Locacao).filter(models.Locacao.id == locacao_id).first()
    if not locacao:
        raise HTTPException(status_code=404, detail="Locação não encontrada")

    db.delete(locacao)
    db.commit()
    return {"detail": "Locação removida com sucesso"}
