🚗 AlyLoca — Sistema de Locação de Veículos

Sistema completo para gerenciamento de locadora de veículos, incluindo controle de clientes, frota, locações e pagamentos.
Desenvolvido com FastAPI + SQLite + Frontend web em HTML/CSS/JavaScript puro.

Ideal para uso acadêmico, estudos e evolução para sistemas reais com PostgreSQL e deploy online.

📌 Funcionalidades

✔ Cadastro, edição e exclusão de clientes
✔ Gerenciamento de veículos (marca, modelo, placa, ano, valor da diária)
✔ Registro de locações com cálculo automático do total
✔ Registro de pagamentos vinculados à locação
✔ Interface web com abas e tabelas dinâmicas
✔ API REST completa integrada com o frontend
✔ Banco SQLite local (podendo trocar facilmente por PostgreSQL/MySQL)

🖥️ Tecnologias Utilizadas
Backend
Tecnologia	Uso
FastAPI	API REST
SQLAlchemy ORM	Banco e mapeamento de tabelas
SQLite	Banco local
Pydantic	Schemas e validação
Uvicorn	Servidor de execução
Frontend
Tecnologia	Uso
HTML5	Estrutura visual
CSS3	Estilização moderna e responsiva
JavaScript	Integração com API e CRUD dinâmico
📂 Estrutura do Projeto
AlyLoca/
│── main.py              # Inicialização do FastAPI
│── database.py          # Conexão e criação do banco
│── models.py            # Modelos ORM
│── schemas.py           # Schemas Pydantic
│── requirements.txt     # Dependências do projeto
│── routers/             # Rotas da API
│   ├── clientes.py
│   ├── veiculos.py
│   ├── locacoes.py
│   └── pagamentos.py
│
└── frontend/            # Interface web
    ├── index.html
    ├── styles.css
    └── app.js

🚀 Como Executar o Projeto
1️⃣ Criar ambiente virtual
python -m venv venv

2️⃣ Ativar ambiente

Windows:

venv\Scripts\activate


Linux/Mac:

source venv/bin/activate

3️⃣ Instalar dependências
pip install -r requirements.txt

4️⃣ Rodar o servidor
uvicorn main:app --reload

5️⃣ Acessar no navegador
http://127.0.0.1:8000


O frontend será carregado automaticamente.

📡 Endpoints da API
Método	Rota	Descrição
GET	/api/clientes	Lista clientes
POST	/api/clientes	Cria cliente
PUT	/api/clientes/{id}	Atualiza cliente
DELETE	/api/clientes/{id}	Remove cliente

🔹 Veículos, Locações e Pagamentos seguem o mesmo padrão.

📄 Licença

Projeto acadêmico — livre para uso e modificação.
