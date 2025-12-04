from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Cliente(Base):
    __tablename__ = 'clientes'
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, nullable=True)
    telefone = Column(String, nullable=True)
    cpf = Column(String, nullable=True)

    locacoes = relationship('Locacao', back_populates='cliente', cascade='all, delete-orphan')

class Veiculo(Base):
    __tablename__ = 'veiculos'
    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String, nullable=False)
    modelo = Column(String, nullable=False)
    placa = Column(String, nullable=False, unique=True)
    ano = Column(Integer, nullable=True)
    valor_diaria = Column(Float, nullable=False)

    locacoes = relationship('Locacao', back_populates='veiculo', cascade='all, delete-orphan')

class Locacao(Base):
    __tablename__ = 'locacoes'
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey('clientes.id'))
    veiculo_id = Column(Integer, ForeignKey('veiculos.id'))
    data_retirada = Column(String)  # ISO date string
    data_devolucao = Column(String)  # ISO date string
    total = Column(Float, nullable=False, default=0.0)

    cliente = relationship('Cliente', back_populates='locacoes')
    veiculo = relationship('Veiculo', back_populates='locacoes')
    pagamentos = relationship('Pagamento', back_populates='locacao', cascade='all, delete-orphan')

class Pagamento(Base):
    __tablename__ = 'pagamentos'
    id = Column(Integer, primary_key=True, index=True)
    locacao_id = Column(Integer, ForeignKey('locacoes.id'))
    valor = Column(Float, nullable=False)
    metodo = Column(String, nullable=True)

    locacao = relationship('Locacao', back_populates='pagamentos')