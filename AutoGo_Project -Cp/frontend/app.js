const api = '/api';

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro HTTP ${res.status}`);
  }
  return res.json();
}

function formatarDataBR(data) {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

/* ========================= */
/*  MODAL DE CONFIRMAÇÃO     */
/* ========================= */

function showConfirm(message, icon = "⚠️") {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const text = document.getElementById("confirm-text");
    const iconBox = modal.querySelector(".modal-icon span");

    text.textContent = message;
    iconBox.textContent = icon;

    modal.classList.remove("hidden");

    document.getElementById("confirm-yes").onclick = () => {
      modal.classList.add("hidden");
      resolve(true);
    };

    document.getElementById("confirm-no").onclick = () => {
      modal.classList.add("hidden");
      resolve(false);
    };
  });
}

/* ========================= */
/*          TOASTS           */
/* ========================= */

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ========================= */
/* FUNÇÕES DE ANIMAÇÃO FIXADAS */
/* ========================= */

/* Flash azul ao editar */
function animateRowUpdate(tableId, id) {
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    const firstCell = row.querySelector("td");
    const cellId = Number(firstCell.textContent.replace(/\D/g, ''));
    if (cellId === id) {
      row.classList.remove("row-update-flash");
      void row.offsetWidth;
      row.classList.add("row-update-flash");
    }
  });
}

/* Fade-out ao excluir */
async function animateRowDelete(tableId, id) {
  return new Promise(resolve => {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach(row => {
      const firstCell = row.querySelector("td");
      const cellId = Number(firstCell.textContent.replace(/\D/g, ''));
      if (cellId === id) {

        row.classList.add("row-removing");

        setTimeout(() => resolve(), 450);
      }
    });
  });
}

/* ========================= */
/*      TABS                */
/* ========================= */

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

/* ========================= */
/*   LOAD LISTS / SELECTS   */
/* ========================= */

/* ------- CLIENTES -------- */
async function loadClientes() {
  const clientes = await fetchJSON(`${api}/clientes/`);
  const tbody = document.querySelector('#tblClientes tbody');
  const sel = document.getElementById('selClientes');

  tbody.innerHTML = '';
  sel.innerHTML = '';

  clientes.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>👤 ${c.id}</td>
      <td>${c.nome}</td>
      <td>${c.telefone || ''}</td>
      <td>${c.email || ''}</td> 
      <td>${c.cpf || ''}</td>
      <td class="actions">
        <button class="edit" onclick="startEditCliente(${c.id})">Editar</button>
        <button class="delete" onclick="deleteCliente(${c.id})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);

    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nome;
    sel.appendChild(opt);
  });
}

/* ------- VEÍCULOS -------- */
async function loadVeiculos() {
  const veiculos = await fetchJSON(`${api}/veiculos/`);
  const tbody = document.querySelector('#tblVeiculos tbody');
  const sel = document.getElementById('selVeiculos');

  tbody.innerHTML = '';
  sel.innerHTML = '';

  veiculos.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>🚗 ${v.id}</td>
      <td>${v.marca}</td>
      <td>${v.modelo}</td>
      <td>${v.placa}</td>
      <td>${v.ano || ''}</td>
      <td>R$ ${v.valor_diaria.toFixed(2)}</td>
      <td class="actions">
        <button class="edit" onclick="startEditVeiculo(${v.id})">Editar</button>
        <button class="delete" onclick="deleteVeiculo(${v.id})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);

    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.marca} ${v.modelo}`;
    sel.appendChild(opt);
  });
}

/* ------- LOCAÇÕES -------- */
async function loadLocacoes() {
  const locacoes = await fetchJSON(`${api}/locacoes/`);
  const tbody = document.querySelector('#tblLocacoes tbody');
  const sel = document.getElementById('selLocacoes');

  tbody.innerHTML = '';
  sel.innerHTML = '';

  locacoes.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>📝 ${l.id}</td>
      <td>${l.cliente_nome}</td>
      <td>${l.veiculo_nome}</td>
      <td>${formatarDataBR(l.data_retirada)}</td>
      <td>${formatarDataBR(l.data_devolucao)}</td>
      <td>R$ ${l.total.toFixed(2)}</td>
      <td class="actions">
        <button class="edit" onclick="startEditLocacao(${l.id})">Editar</button>
        <button class="delete" onclick="deleteLocacao(${l.id})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);

    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent =
      `🚗 ${l.veiculo_nome} | 👤 ${l.cliente_nome} | 💰 R$ ${l.total.toFixed(2)}`;
    sel.appendChild(opt);
  });
}

/* ------- PAGAMENTOS -------- */
async function loadPagamentos() {
  const pagamentos = await fetchJSON(`${api}/pagamentos/`);
  const tbody = document.querySelector('#tblPagamentos tbody');

  tbody.innerHTML = '';

  pagamentos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>💳 ${p.id}</td>
      <td>${p.locacao_id}</td>
      <td>R$ ${p.valor.toFixed(2)}</td>
      <td>${p.metodo || ''}</td>
      <td class="actions">
        <button class="edit" onclick="startEditPagamento(${p.id})">Editar</button>
        <button class="delete" onclick="deletePagamento(${p.id})">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function reloadAll() {
  await Promise.all([
    loadClientes(),
    loadVeiculos(),
    loadLocacoes(),
    loadPagamentos(),
  ]);
}

/* ========================= */
/* CRUD — CLIENTES          */
/* ========================= */

let editingCliente = null;

document.getElementById('btnSalvarCliente').addEventListener('click', async () => {
  const payload = {
    nome: document.getElementById('cliNome').value,
    email: document.getElementById('cliEmail').value,
    telefone: document.getElementById('cliTelefone').value,
    cpf: document.getElementById('cliCPF').value
  };

  try {
    if (editingCliente) {
      await fetchJSON(`${api}/clientes/${editingCliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      animateRowUpdate("tblClientes", editingCliente);

    } else {
      await fetchJSON(`${api}/clientes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    editingCliente = null;
    document.getElementById('btnSalvarCliente').textContent = 'Salvar Cliente';
    document.getElementById('cliNome').value = '';
    document.getElementById('cliTelefone').value = '';
    document.getElementById('cliCPF').value = '';
    await reloadAll();

  } catch (e) {
    alert('Erro ao salvar cliente: ' + e.message);
  }
});

document.getElementById('btnLimparCliente').addEventListener('click', () => {
  editingCliente = null;
  document.getElementById('btnSalvarCliente').textContent = 'Salvar Cliente';
  document.getElementById('cliNome').value = '';
  document.getElementById('cliTelefone').value = '';
  document.getElementById('cliCPF').value = '';
  document.getElementById('cliEmail').value = '';
});

window.startEditCliente = async function (id) {
  const c = await fetchJSON(`${api}/clientes/${id}`);
  editingCliente = id;

  document.getElementById('cliNome').value = c.nome;
  document.getElementById('cliTelefone').value = c.telefone || '';
  document.getElementById('cliCPF').value = c.cpf || '';
  document.getElementById('cliEmail').value = c.email || '';

  document.getElementById('btnSalvarCliente').textContent = 'Atualizar Cliente';
};

window.deleteCliente = async function (id) {
  try {
    if (!(await showConfirm('Excluir este cliente?', '🗑️'))) return;
    await animateRowDelete("tblClientes", id);
    await fetchJSON(`${api}/clientes/${id}`, { method: 'DELETE' });
    await reloadAll();
    showToast('Cliente excluído com sucesso!', 'success');
  } catch (e) {
    showToast('Erro ao excluir cliente: ' + e.message, 'error');
  }
};

/* ========================= */
/* CRUD — VEÍCULOS          */
/* ========================= */

let editingVeiculo = null;

document.getElementById('btnSalvarVeiculo').addEventListener('click', async () => {
  const payload = {
    marca: document.getElementById('veiMarca').value,
    modelo: document.getElementById('veiModelo').value,
    placa: document.getElementById('veiPlaca').value,
    ano: document.getElementById('veiAno').value ? parseInt(document.getElementById('veiAno').value) : null,
    valor_diaria: parseFloat(document.getElementById('veiValor').value) || 0
  };

  try {
    if (editingVeiculo) {
      await fetchJSON(`${api}/veiculos/${editingVeiculo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      animateRowUpdate("tblVeiculos", editingVeiculo);

    } else {
      await fetchJSON(`${api}/veiculos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    editingVeiculo = null;
    document.getElementById('btnSalvarVeiculo').textContent = 'Salvar Veículo';

    ['veiMarca', 'veiModelo', 'veiPlaca', 'veiAno', 'veiValor']
      .forEach(id => document.getElementById(id).value = '');

    await reloadAll();

  } catch (e) {
    alert('Erro ao salvar veículo: ' + e.message);
  }
});

document.getElementById('btnLimparVeiculo').addEventListener('click', () => {
  editingVeiculo = null;
  document.getElementById('btnSalvarVeiculo').textContent = 'Salvar Veículo';
  ['veiMarca', 'veiModelo', 'veiPlaca', 'veiAno', 'veiValor']
    .forEach(id => document.getElementById(id).value = '');
});

window.startEditVeiculo = async function (id) {
  const v = await fetchJSON(`${api}/veiculos/${id}`);
  editingVeiculo = id;

  document.getElementById('veiMarca').value = v.marca;
  document.getElementById('veiModelo').value = v.modelo;
  document.getElementById('veiPlaca').value = v.placa;
  document.getElementById('veiAno').value = v.ano || '';
  document.getElementById('veiValor').value = v.valor_diaria;

  document.getElementById('btnSalvarVeiculo').textContent = 'Atualizar Veículo';
};

window.deleteVeiculo = async function (id) {
  try {
    if (!(await showConfirm('Excluir este veículo?', '🚗'))) return;
    await animateRowDelete("tblVeiculos", id);
    await fetchJSON(`${api}/veiculos/${id}`, { method: 'DELETE' });
    await reloadAll();
    showToast('Veículo excluído com sucesso!', 'success');
  } catch (e) {
    showToast('Erro ao excluir veículo: ' + e.message, 'error');
  }
};

/* ========================= */
/* CRUD — LOCAÇÕES          */
/* ========================= */

let editingLocacao = null;

document.getElementById('btnSalvarLocacao').addEventListener('click', async () => {
  const payload = {
    cliente_id: parseInt(document.getElementById('selClientes').value),
    veiculo_id: parseInt(document.getElementById('selVeiculos').value),
    data_retirada: document.getElementById('dataRetirada').value,
    data_devolucao: document.getElementById('dataDevolucao').value
  };

  try {
    if (editingLocacao) {
      await fetchJSON(`${api}/locacoes/${editingLocacao}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      animateRowUpdate("tblLocacoes", editingLocacao);

    } else {
      await fetchJSON(`${api}/locacoes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    editingLocacao = null;
    document.getElementById('btnSalvarLocacao').textContent = 'Criar Locação';

    document.getElementById('dataRetirada').value = '';
    document.getElementById('dataDevolucao').value = '';

    await reloadAll();

  } catch (e) {
    alert('Erro ao salvar locação: ' + e.message);
  }
});

document.getElementById('btnLimparLocacao').addEventListener('click', () => {
  editingLocacao = null;
  document.getElementById('btnSalvarLocacao').textContent = 'Criar Locação';
  document.getElementById('dataRetirada').value = '';
  document.getElementById('dataDevolucao').value = '';
});

window.startEditLocacao = async function (id) {
  const l = await fetchJSON(`${api}/locacoes/${id}`);
  editingLocacao = id;

  document.getElementById('selClientes').value = l.cliente_id;
  document.getElementById('selVeiculos').value = l.veiculo_id;
  document.getElementById('dataRetirada').value = l.data_retirada;
  document.getElementById('dataDevolucao').value = l.data_devolucao;

  document.getElementById('btnSalvarLocacao').textContent = 'Atualizar Locação';
};

window.deleteLocacao = async function (id) {
  try {
    if (!(await showConfirm('Excluir esta locação?', '📅'))) return;
    await animateRowDelete("tblLocacoes", id);
    await fetchJSON(`${api}/locacoes/${id}`, { method: 'DELETE' });
    await reloadAll();
    showToast('Locação excluída com sucesso!', 'success');
  } catch (e) {
    showToast('Erro ao excluir locação: ' + e.message, 'error');
  }
};

/* ========================= */
/* CRUD — PAGAMENTOS        */
/* ========================= */

let editingPagamento = null;

document.getElementById('btnSalvarPagamento').addEventListener('click', async () => {
  const payload = {
    locacao_id: parseInt(document.getElementById('selLocacoes').value),
    valor: parseFloat(document.getElementById('pagValor').value) || 0,
    metodo: document.getElementById('pagMetodo').value
  };

  try {
    if (editingPagamento) {
      await fetchJSON(`${api}/pagamentos/${editingPagamento}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      animateRowUpdate("tblPagamentos", editingPagamento);

    } else {
      await fetchJSON(`${api}/pagamentos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    editingPagamento = null;
    document.getElementById('btnSalvarPagamento').textContent = 'Registrar Pagamento';
    document.getElementById('pagValor').value = '';
    document.getElementById('pagMetodo').value = '';

    await reloadAll();

  } catch (e) {
    alert('Erro ao salvar pagamento: ' + e.message);
  }
});

document.getElementById('btnLimparPagamento').addEventListener('click', () => {
  editingPagamento = null;
  document.getElementById('btnSalvarPagamento').textContent = 'Registrar Pagamento';
  document.getElementById('pagValor').value = '';
  document.getElementById('pagMetodo').value = '';
});

window.startEditPagamento = async function (id) {
  const p = await fetchJSON(`${api}/pagamentos/${id}`);
  editingPagamento = id;

  document.getElementById('selLocacoes').value = p.locacao_id;
  document.getElementById('pagValor').value = p.valor;
  document.getElementById('pagMetodo').value = p.metodo || '';

  document.getElementById('btnSalvarPagamento').textContent = 'Atualizar Pagamento';
};

window.deletePagamento = async function (id) {
  try {
    if (!(await showConfirm('Excluir este pagamento?', '💰'))) return;
    await animateRowDelete("tblPagamentos", id);
    await fetchJSON(`${api}/pagamentos/${id}`, { method: 'DELETE' });
    await reloadAll();
    showToast('Pagamento excluído com sucesso!', 'success');
  } catch (e) {
    showToast('Erro ao excluir pagamento: ' + e.message, 'error');
  }
};

/* ========================= */
/*          INIT            */
/* ========================= */

document.addEventListener('DOMContentLoaded', () => {
  reloadAll();
});
