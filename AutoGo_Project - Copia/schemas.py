from pydantic import BaseModel, ConfigDict
from typing import Optional


# =================== CLIENTES ===================

class ClienteBase(BaseModel):
    nome: str
    email: Optional[str] = None
    telefone: Optional[str] = None
    cpf: Optional[str] = None


class ClienteCreate(ClienteBase):
    pass


class Cliente(ClienteBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# =================== VEÍCULOS ===================

class VeiculoBase(BaseModel):
    marca: str
    modelo: str
    placa: str
    ano: Optional[int] = None
    valor_diaria: float


class VeiculoCreate(VeiculoBase):
    pass


class Veiculo(VeiculoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# =================== LOCAÇÕES ===================

class LocacaoBase(BaseModel):
    cliente_id: int
    veiculo_id: int
    data_retirada: str   # formato yyyy-mm-dd
    data_devolucao: str  # formato yyyy-mm-dd


class LocacaoCreate(LocacaoBase):
    pass


class Locacao(LocacaoBase):
    id: int
    total: float
    model_config = ConfigDict(from_attributes=True)


# =================== PAGAMENTOS ===================

class PagamentoBase(BaseModel):
    locacao_id: int
    valor: float
    metodo: Optional[str] = None


class PagamentoCreate(PagamentoBase):
    pass


class Pagamento(PagamentoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
