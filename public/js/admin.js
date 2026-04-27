const API = '/api';

async function loadInventory() {
  const res = await fetch(API + '/inventory');
  const items = await res.json();
  document.getElementById('inventory-list').innerHTML =
    items.map(i => '<div class="card"><strong>' + i.name + '</strong> - ' + i.status + ' (qty: ' + i.quantity + ')</div>').join('');
}

async function loadReports() {
  const res = await fetch(API + '/segnalazioni');
  const reports = await res.json();
  document.getElementById('reports-list').innerHTML =
    reports.map(r => '<div class="card"><strong>' + r.user_name + '</strong> - ' + r.reason + ' [' + r.status + ']</div>').join('');
}

loadInventory();
loadReports();
