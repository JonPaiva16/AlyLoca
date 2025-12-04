from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import clientes, veiculos, locacoes, pagamentos
import database

app = FastAPI(title='AutoGo - Locadora')

# Inicializa DB (cria tabelas)
database.Base.metadata.create_all(bind=database.engine)

app.include_router(clientes.router, prefix='/api/clientes', tags=['clientes'])
app.include_router(veiculos.router, prefix='/api/veiculos', tags=['veiculos'])
app.include_router(locacoes.router, prefix='/api/locacoes', tags=['locacoes'])
app.include_router(pagamentos.router, prefix='/api/pagamentos', tags=['pagamentos'])

# Servir frontend estático
app.mount('/', StaticFiles(directory='frontend', html=True), name='frontend')