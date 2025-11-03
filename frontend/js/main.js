const apiBase = "/api/v1";

function showMsg(text, type="info") {
  const id = "toast-root";
  let root = document.getElementById(id);
  if (!root) {
    root = document.createElement("div");
    root.id = id;
    root.style.position = "fixed";
    root.style.top = "20px";
    root.style.right = "20px";
    root.style.zIndex = 9999;
    document.body.appendChild(root);
  }
  const el = document.createElement("div");
  el.textContent = text;
  el.style.padding = "10px 14px";
  el.style.marginTop = "8px";
  el.style.borderRadius = "8px";
  el.style.color = "#fff";
  el.style.boxShadow = "0 6px 18px rgba(2,6,23,0.08)";
  if (type === "success") el.style.background = "#10B981";
  else if (type === "error") el.style.background = "#EF4444";
  else el.style.background = "#0033A0";
  root.appendChild(el);
  setTimeout(()=> el.remove(), 3500);
}

async function fetchJson(url, opts){
  const res = await fetch(url, opts);
  if(!res.ok){
    const txt = await res.text();
    throw new Error(txt || res.status);
  }
  return res.json();
}

async function loadAll(){
  try{
    const [clientes, veiculos, locacoes, pagamentos] = await Promise.all([
      fetchJson(apiBase + "/clientes"),
      fetchJson(apiBase + "/veiculos"),
      fetchJson(apiBase + "/locacoes"),
      fetchJson(apiBase + "/pagamentos")
    ]);
    renderClientes(clientes);
    renderVeiculos(veiculos);
    renderLocacoes(locacoes);
    renderPagamentos(pagamentos);
    populateSelects(clientes, veiculos, locacoes);
  }catch(e){
    console.error(e);
    showMsg("Erro ao carregar dados", "error");
  }
}

function renderClientes(list){
  const el = document.getElementById("clientesList");
  if(!list || list.length===0){ el.innerHTML="<p class='text-sm text-gray-500'>Nenhum cliente</p>"; return; }
  el.innerHTML = "<ul class='space-y-2'>" + list.map(c=>`<li class='flex justify-between items-center'><div><strong>${c.nome}</strong><div class='text-xs text-gray-500'>${c.email||''} ${c.cpf||''}</div></div><div><button onclick='del("clientes",${c.id})' class='text-red-500 text-sm'>Excluir</button></div></li>`).join("") + "</ul>";
}

function renderVeiculos(list){
  const el = document.getElementById("veiculosList");
  if(!list || list.length===0){ el.innerHTML="<p class='text-sm text-gray-500'>Nenhum veículo</p>"; return; }
  el.innerHTML = "<ul class='space-y-2'>" + list.map(v=>`<li class='flex justify-between items-center'><div><strong>${v.marca} ${v.modelo}</strong><div class='text-xs text-gray-500'>${v.placa} • R$ ${v.valor_diaria}</div></div><div><button onclick='del("veiculos",${v.id})' class='text-red-500 text-sm'>Excluir</button></div></li>`).join("") + "</ul>";
}

function renderLocacoes(list){
  const el = document.getElementById("locacoesList");
  if(!list || list.length===0){ el.innerHTML="<p class='text-sm text-gray-500'>Nenhuma locação</p>"; return; }
  el.innerHTML = "<table class='w-full text-sm'><thead class='text-left text-xs text-gray-500'><tr><th>ID</th><th>Cliente</th><th>Veículo</th><th>Período</th><th>Valor</th><th>Status</th></tr></thead><tbody>" +
    list.map(l=>`<tr><td class='py-2'>${l.id}</td><td>${l.cliente_id}</td><td>${l.veiculo_id}</td><td>${l.data_inicio} → ${l.data_fim}</td><td>R$ ${l.valor_total}</td><td>${l.status}</td></tr>`).join("") + "</tbody></table>";
}

function renderPagamentos(list){
  const el = document.getElementById("pagamentosList");
  if(!list || list.length===0){ el.innerHTML="<p class='text-sm text-gray-500'>Nenhum pagamento</p>"; return; }
  el.innerHTML = "<ul class='space-y-2'>" + list.map(p=>`<li class='flex justify-between items-center'><div>#${p.id} • Locação ${p.locacao_id} • R$ ${p.valor}</div><div class='text-xs text-gray-500'>${p.data_pagamento||''}</div></li>`).join("") + "</ul>";
}

function populateSelects(clientes, veiculos, locacoes){
  const csel = document.getElementById("loc_cliente");
  const vsel = document.getElementById("loc_veiculo");
  const lsel = document.getElementById("pag_locacao");
  csel.innerHTML = '<option value="">Selecione cliente</option>' + (clientes||[]).map(c=>`<option value="${c.id}">${c.nome}</option>`).join("");
  vsel.innerHTML = '<option value="">Selecione veículo</option>' + (veiculos||[]).map(v=>`<option value="${v.id}">${v.marca} ${v.modelo} - ${v.placa}</option>`).join("");
  lsel.innerHTML = '<option value="">Selecione locação</option>' + (locacoes||[]).map(l=>`<option value="${l.id}">#${l.id} - ${l.cliente_id} / ${l.veiculo_id}</option>`).join("");
}

async function createCliente(e){
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try{
    await fetchJson(apiBase + "/clientes", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
    e.target.reset();
    showMsg("Cliente criado", "success");
    loadAll();
  }catch(err){ console.error(err); showMsg("Erro criar cliente", "error"); }
}

async function createVeiculo(e){
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  data.valor_diaria = parseFloat(data.valor_diaria) || 0;
  try{
    await fetchJson(apiBase + "/veiculos", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
    e.target.reset();
    showMsg("Veículo criado", "success");
    loadAll();
  }catch(err){ console.error(err); showMsg("Erro criar veículo", "error"); }
}

async function createLocacao(e){
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try{
    await fetchJson(apiBase + "/locacoes", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
    e.target.reset();
    showMsg("Locação criada", "success");
    loadAll();
  }catch(err){ console.error(err); showMsg("Erro criar locação", "error"); }
}

async function createPagamento(e){
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try{
    await fetchJson(apiBase + "/pagamentos", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
    e.target.reset();
    showMsg("Pagamento registrado", "success");
    loadAll();
  }catch(err){ console.error(err); showMsg("Erro criar pagamento", "error"); }
}

async function del(tipo,id){
  if(!confirm("Confirma exclusão?")) return;
  try{
    await fetch(apiBase + "/" + tipo + "/" + id, { method:"DELETE" });
    showMsg("Excluído", "success");
    loadAll();
  }catch(e){ console.error(e); showMsg("Erro excluir", "error"); }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAll();
});
