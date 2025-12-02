📘 Alyloca — Sistema de Locação de Veículos

Um projeto completo com FastAPI + SQLite + Frontend em HTML/CSS/JS

🚗 Sobre o Projeto

AutoGo é um sistema completo para gestão de uma locadora de veículos, permitindo o gerenciamento de:

Clientes

Veículos

Locações

Pagamentos

O sistema possui:

✔ API RESTful em FastAPI
✔ Banco de dados SQLite com SQLAlchemy
✔ Frontend moderno em HTML/CSS/JS puro
✔ CRUD completo (Criar, Listar, Editar e Deletar)
✔ Interface interativa com abas e tabelas dinâmicas
✔ Cálculo automático do valor total da locação

Ideal para estudo de APIs, CRUD, banco de dados, integração frontend-backend e arquitetura limpa.

🛠 Tecnologias Utilizadas
Backend

Python 3.11+

FastAPI

SQLAlchemy ORM

Pydantic v2

Uvicorn

SQLite (padrão, mas pode ser alterado para PostgreSQL facilmente)

Frontend

HTML5

CSS3 (design moderno, estilo dashboard)

JavaScript (fetch API)

Tabelas dinâmicas e CRUD interativo

📂 Estrutura do Projeto
AutoGo_Project/
│
├── main.py
├── database.py
├── models.py
├── schemas.py
│
├── routers/
│   ├── clientes.py
│   ├── veiculos.py
│   ├── locacoes.py
│   └── pagamentos.py
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
└── README.md

▶️ Como Rodar o Projeto
1️⃣ Criar ambiente virtual
python -m venv venv

2️⃣ Ativar o ambiente

Windows:

venv\Scripts\activate

3️⃣ Instalar dependências
pip install -r requirements.txt

4️⃣ Rodar o servidor FastAPI
uvicorn main:app --reload

5️⃣ Abrir o frontend

Acesse no navegador:

👉 http://127.0.0.1:8000/

A interface completa será carregada, já conectada ao backend.

🧠 Funcionalidades
✔ Clientes

Cadastrar cliente

Editar cliente

Excluir cliente

Listagem com tabela interativa

✔ Veículos

Cadastro de veículos

Edição

Exclusão

Valor da diária

✔ Locações

Selecionar cliente e veículo

Inserir datas

Cálculo automático do total

Editar/Excluir

✔ Pagamentos

Selecionar locação

Inserir valor e método

Editar/Excluir

🌐 API Endpoints
Clientes
Método	Endpoint	Descrição
GET	/api/clientes/	Listar clientes
GET	/api/clientes/{id}	Buscar cliente por ID
POST	/api/clientes/	Criar cliente
PUT	/api/clientes/{id}	Atualizar cliente
DELETE	/api/clientes/{id}	Excluir cliente
Veículos

Mesma estrutura de CRUD:

/api/veiculos/

Locações

/api/locacoes/

→ O backend calcula automaticamente o total com base nos dias * valor_da_diaria.

Pagamentos

/api/pagamentos/

🎨 Sobre o Frontend

O frontend foi construído para ser:

Simples

Responsivo

Sem frameworks (puramente HTML/CSS/JS)

Interativo, com tabelas atualizadas em tempo real

A interface é dividida em abas:

[ Clientes ] [ Veículos ] [ Locações ] [ Pagamentos ]


Cada aba possui:

Um formulário de cadastro/edição

Uma tabela com os registros

Botões: Editar, Excluir

🧩 Integração com o Backend

O arquivo app.js se comunica com o backend usando:

fetch('/api/clientes/')
fetch('/api/veiculos/')


e trata tudo em JSON.

Sempre que um registro é criado, atualizado ou removido, a interface recarrega automaticamente os dados.

📌 Observações Importantes

O projeto usa SQLite por padrão (app.db).

Para usar PostgreSQL basta alterar a URI no arquivo database.py.

O Frontend funciona diretamente pelo FastAPI (não precisa de servidor adicional).

📜 Licença

Este projeto foi criado para fins acadêmicos e pode ser usado livremente.

http://localhost:8000/