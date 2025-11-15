from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter()

# Criar veículo
@router.post("/", response_model=schemas.Veiculo)
def create_veiculo(veiculo: schemas.VeiculoCreate, db: Session = Depends(get_db)):
    # Verificar se placa já existe
    existing = db.query(models.Veiculo).filter(models.Veiculo.placa == veiculo.placa).first()
    if existing:
        raise HTTPException(status_code=400, detail="Placa já cadastrada")

    novo = models.Veiculo(**veiculo.dict())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

# Listar veículos
@router.get("/", response_model=list[schemas.Veiculo])
def list_veiculos(db: Session = Depends(get_db)):
    return db.query(models.Veiculo).all()

# Buscar veículo por ID
@router.get("/{veiculo_id}", response_model=schemas.Veiculo)
def get_veiculo(veiculo_id: int, db: Session = Depends(get_db)):
    veiculo = db.query(models.Veiculo).filter(models.Veiculo.id == veiculo_id).first()
    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return veiculo

# Atualizar veículo
@router.put("/{veiculo_id}", response_model=schemas.Veiculo)
def update_veiculo(veiculo_id: int, dados: schemas.VeiculoCreate, db: Session = Depends(get_db)):
    veiculo = db.query(models.Veiculo).filter(models.Veiculo.id == veiculo_id).first()

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    # Verificar se placa nova já existe em outro veículo
    if dados.placa != veiculo.placa:
        placa_existente = db.query(models.Veiculo).filter(models.Veiculo.placa == dados.placa).first()
        if placa_existente:
            raise HTTPException(status_code=400, detail="Essa placa já pertence a outro veículo")

    for key, value in dados.dict().items():
        setattr(veiculo, key, value)

    db.commit()
    db.refresh(veiculo)
    return veiculo

# Excluir veículo
@router.delete("/{veiculo_id}")
def delete_veiculo(veiculo_id: int, db: Session = Depends(get_db)):
    veiculo = db.query(models.Veiculo).filter(models.Veiculo.id == veiculo_id).first()
    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    db.delete(veiculo)
    db.commit()
    return {"detail": "Veículo removido com sucesso"}
