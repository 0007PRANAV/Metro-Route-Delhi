const stations = [
  {name:'Rajiv Chowk', lines:['Blue','Yellow'], status:'Open', category:'Interchange', alternatives:['Barakhamba Road','Patel Chowk'], reason:'Central interchange and high traffic.', updated:'Just now', favorite:true},
  {name:'Kashmere Gate', lines:['Red','Yellow','Violet'], status:'Limited', category:'Interchange', alternatives:['Civil Lines','Lal Qila'], reason:'Partial platform access during maintenance.', updated:'8 min ago'},
  {name:'AIIMS', lines:['Yellow'], status:'Open', category:'Healthcare', alternatives:['INA','Green Park'], reason:'Fully operational.', updated:'2 min ago'},
  {name:'Mandi House', lines:['Blue','Violet'], status:'Closed', category:'Interchange', alternatives:['Janpath','ITO'], reason:'Temporary restriction due to operational work.', updated:'15 min ago'},
  {name:'Hauz Khas', lines:['Yellow','Magenta'], status:'Open', category:'Interchange', alternatives:['Green Park','Panchsheel Park'], reason:'Normal service.', updated:'5 min ago'},
  {name:'Dwarka Sector 21', lines:['Blue','Airport Express'], status:'Open', category:'Airport Link', alternatives:['Dwarka Sector 8'], reason:'Operational and open.', updated:'3 min ago'},
  {name:'Noida Electronic City', lines:['Blue'], status:'Limited', category:'Terminal', alternatives:['Noida Sector 62'], reason:'Reduced frequency.', updated:'12 min ago'},
  {name:'Janakpuri West', lines:['Blue','Magenta'], status:'Open', category:'Interchange', alternatives:['Uttam Nagar East','Tilak Nagar'], reason:'Normal service.', updated:'1 min ago'}
];

let state = {
  q: '',
  status: 'All',
  line: 'All',
  sort: 'Relevance',
  fav: false,
  recent: false,
  selected: stations[0].name
};

let recent = [];
const $ = id => document.getElementById(id);

const statuses = ['All','Open','Closed','Limited'];
const lines = ['All', ...[...new Set(stations.flatMap(s => s.lines))]];
const sorts = ['Relevance','A-Z','Status'];

function buildButtons(root, items, key){
  root.innerHTML = items.map(v => `<button class="pill ${state[key]===v?'active':''}" data-k="${key}" data-v="${v}">${v}</button>`).join('');
}
buildButtons($('statusFilters'), statuses, 'status');
buildButtons($('lineFilters'), lines, 'line');
buildButtons($('sortFilters'), sorts, 'sort');

function relevance(s){
  let score = 0;
  const q = state.q.toLowerCase();
  if (!q) score += 0;
  else {
    if (s.name.toLowerCase().includes(q)) score += 3;
    if (s.lines.join(' ').toLowerCase().includes(q)) score += 2;
    if (s.category.toLowerCase().includes(q)) score += 1;
    if (s.reason.toLowerCase().includes(q)) score += 1;
  }
  if (state.status !== 'All' && s.status === state.status) score += 2;
  if (state.line !== 'All' && s.lines.includes(state.line)) score += 2;
  if (state.fav && s.favorite) score += 2;
  return score;
}

function filtered(){
  let arr = stations.filter(s => {
    const q = state.q.toLowerCase();
    const okq = !q || [s.name, s.category, ...s.lines, ...s.alternatives, s.reason].join(' ').toLowerCase().includes(q);
    const oks = state.status === 'All' || s.status === state.status;
    const okl = state.line === 'All' || s.lines.includes(state.line);
    const okf = !state.fav || s.favorite;
    return okq && oks && okl && okf;
  });

  if (state.sort === 'A-Z') arr.sort((a,b) => a.name.localeCompare(b.name));
  else if (state.sort === 'Status') arr.sort((a,b) => a.status.localeCompare(b.status));
  else arr.sort((a,b) => relevance(b) - relevance(a));

  return arr;
}

function suggestions(list){
  if (!state.q) return [];
  const q = state.q.toLowerCase();
  const seen = new Set();
  return list.concat(stations).filter(s => {
    const hit = s.name.toLowerCase().includes(q) || s.lines.join(' ').toLowerCase().includes(q);
    if (!hit || seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  }).slice(0,6);
}

function renderSuggestions(list){
  const box = $('suggestions');
  const arr = suggestions(list);

  if (!state.q) {
    box.classList.remove('show');
    box.setAttribute('aria-expanded','false');
    box.innerHTML = '';
    return;
  }

  box.innerHTML = arr.length
    ? arr.map((s,i) => `<button type="button" data-name="${s.name}" class="${i===0?'active':''}" role="option" aria-selected="${i===0?'true':'false'}">${s.name}<span class="muted"> · ${s.lines.join(', ')}</span></button>`).join('')
    : '<button type="button" disabled>No suggestions</button>';

  box.classList.add('show');
  box.setAttribute('aria-expanded','true');
}

function render(){
  const list = filtered();

  $('countChip').textContent = `${stations.length} stations`;
  $('statusChip').textContent = `${stations.filter(s => s.status === 'Open').length} open`;
  $('resultMeta').textContent = `${list.length} result${list.length!==1?'s':''} for ${state.q || 'all stations'}`;

  $('miniSummary').innerHTML = `
    <div class="kpis">
      <div class="kpi"><b>${list.filter(s => s.status==='Open').length}</b><span>Open</span></div>
      <div class="kpi"><b>${list.filter(s => s.status==='Closed').length}</b><span>Closed</span></div>
      <div class="kpi"><b>${list.filter(s => s.status==='Limited').length}</b><span>Limited</span></div>
    </div>`;

  $('routeTips').textContent = 'Use filters to narrow stations by line or status. Click a station for alternatives.';

  $('resultsList').innerHTML = list.length
    ? list.map(s => `
      <div class="station ${state.selected===s.name?'selected':''}" data-name="${s.name}">
        <div class="row">
          <div>
            <div class="name">${s.name}</div>
            <div class="muted" style="font-size:12px;margin-top:3px;">${s.lines.join(' • ')}</div>
          </div>
          <span class="status ${s.status.toLowerCase()}">${s.status}</span>
        </div>
        <div class="meta">
          <span class="tag">${s.category}</span>
          <span class="tag">${s.updated}</span>
        </div>
      </div>`).join('')
    : '<div class="empty">No stations match your search.</div>';

  const s = stations.find(x => x.name === state.selected) || list[0] || stations[0];
  if (s) {
    state.selected = s.name;
    $('detailPane').innerHTML = `
      <div class="hero">
        <h3>${s.name}</h3>
        <p>${s.reason}</p>
        <div class="meta" style="margin-top:12px">
          <span class="status ${s.status.toLowerCase()}">${s.status}</span>
          <span class="tag">${s.category}</span>
          <span class="tag">Updated ${s.updated}</span>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><b>${s.lines.length}</b><span>Lines</span></div>
        <div class="kpi"><b>${s.alternatives.length}</b><span>Alternatives</span></div>
        <div class="kpi"><b>${s.favorite ? 'Yes' : 'No'}</b><span>Favorite</span></div>
      </div>
      <div class="panel">
        <div class="muted" style="font-size:12px;margin-bottom:8px;">Lines</div>
        <div class="alt">${s.lines.map(l => `<span class="tag">${l}</span>`).join('')}</div>
      </div>
      <div class="panel">
        <div class="muted" style="font-size:12px;margin-bottom:8px;">Alternatives</div>
        <div class="alt">${s.alternatives.map(a => `<span class="tag">${a}</span>`).join('')}</div>
      </div>`;
  }

  renderSuggestions(list);
}

function pick(name){
  state.selected = name;
  if (!recent.includes(name)) recent.unshift(name);
  recent = recent.slice(0,5);
  render();
}

$('search').addEventListener('input', e => {
  state.q = e.target.value.trim();
  render();
});

$('search').addEventListener('keydown', e => {
  const items = [...$('suggestions').querySelectorAll('button:not([disabled])')];
  if (!items.length) return;

  const active = items.findIndex(x => x.classList.contains('active'));

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    items.forEach(x => x.classList.remove('active'));
    items[(active + 1) % items.length].classList.add('active');
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    items.forEach(x => x.classList.remove('active'));
    items[(active - 1 + items.length) % items.length].classList.add('active');
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const chosen = items.find(x => x.classList.contains('active')) || items[0];
    if (chosen && chosen.dataset.name) {
      $('search').value = chosen.dataset.name;
      state.q = chosen.dataset.name;
      $('suggestions').classList.remove('show');
      $('suggestions').setAttribute('aria-expanded','false');
      pick(chosen.dataset.name);
    }
  } else if (e.key === 'Escape') {
    $('suggestions').classList.remove('show');
    $('suggestions').setAttribute('aria-expanded','false');
  }
});

document.addEventListener('click', e => {
  const p = e.target.closest('.pill');
  if (p) {
    state[p.dataset.k] = p.dataset.v;
    document.querySelectorAll(`[data-k="${p.dataset.k}"]`).forEach(b => b.classList.toggle('active', b.dataset.v === p.dataset.v));
    render();
    return;
  }

  const s = e.target.closest('.station');
  if (s) {
    pick(s.dataset.name);
    return;
  }

  const sug = e.target.closest('#suggestions button');
  if (sug && sug.dataset.name) {
    $('search').value = sug.dataset.name;
    state.q = sug.dataset.name;
    $('suggestions').classList.remove('show');
    $('suggestions').setAttribute('aria-expanded','false');
    pick(sug.dataset.name);
    return;
  }

  if (!e.target.closest('.searchbox')) {
    $('suggestions').classList.remove('show');
    $('suggestions').setAttribute('aria-expanded','false');
  }
});

$('favBtn').onclick = () => {
  state.fav = !state.fav;
  $('favBtn').classList.toggle('active', state.fav);
  render();
};

$('recentBtn').onclick = () => {
  state.recent = !state.recent;
  $('recentBtn').classList.toggle('active', state.recent);
  if (state.recent && recent[0]) {
    $('search').value = recent[0];
    state.q = recent[0];
  }
  render();
};

$('clearBtn').onclick = () => {
  state = { q:'', status:'All', line:'All', sort:'Relevance', fav:false, recent:false, selected:stations[0].name };
  $('search').value = '';
  document.querySelectorAll('.toggle').forEach(b => b.classList.remove('active'));
  buildButtons($('statusFilters'), statuses, 'status');
  buildButtons($('lineFilters'), lines, 'line');
  buildButtons($('sortFilters'), sorts, 'sort');
  render();
};

$('suggestions').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b && b.dataset.name) {
    $('search').value = b.dataset.name;
    state.q = b.dataset.name;
    $('suggestions').classList.remove('show');
    $('suggestions').setAttribute('aria-expanded','false');
    pick(b.dataset.name);
  }
});

render();
