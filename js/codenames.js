'use strict';
// ═══════════════════════════════════════════════════════════════════
//  CODINOMES
// ═══════════════════════════════════════════════════════════════════
const CN_WORDS = [...new Set(`COBRA URSO LEÃO TIGRE LOBO PATO RAPOSA RATO CORVO FALCÃO ÁGUIA TOURO GALO PEIXE ABELHA ARANHA TUBARÃO POLVO BALEIA PANTERA
BANCO CAMPO ILHA PONTE TORRE ESCOLA PRAIA MINA PORTO MURO VALE CASTELO PALÁCIO ARENA FÁBRICA MERCADO JARDIM MUSEU CAVERNA FLORESTA
VULCÃO FAROL TEMPLO CATEDRAL PIRÂMIDE FORTE LABIRINTO ALDEIA HOSPITAL CIRCO CINEMA TEATRO HOTEL PRISÃO FAZENDA DESERTO
CHAVE ESPADA ESCUDO FOGUETE BOMBA LIVRO RELÓGIO CAIXA CORDA ANEL COPO PISTOLA MARTELO FACA ÂNCORA LÂMPADA BOLA DADO CARTA MOEDA
TROFÉU MAPA RODA LANTERNA ESPELHO BARRIL CORRENTE VENENO CRISTAL DIAMANTE COROA SINO TOCHA ESCADA PORTAL COFRE AGULHA TESOURA GARRAFA CHAPÉU
CAPITÃO REI RAINHA DETETIVE MÉDICO PILOTO ESPIÃO SOLDADO BANDIDO ANJO DIABO BRUXA MAGO HERÓI PALHAÇO PIRATA NINJA ROBÔ VAMPIRO
ZUMBI FANTASMA ALIEN DRAGÃO FÊNIX SEREIA UNICÓRNIO OGRO DUENDE PRÍNCIPE CAVALEIRO XERIFE CHEF ASTRONAUTA ENFERMEIRA JUIZ
GELO FOGO ÁGUA TERRA SOL LUA ESTRELA NUVEM VENTO CHUVA RAIO TROVÃO RIO MAR NEVE PEDRA AREIA LAMA NÉVOA AURORA ECLIPSE MARÉ FURACÃO TORNADO ONDA
PÃO MEL LEITE VINHO CAFÉ AÇÚCAR SAL QUEIJO CARNE OVO MAÇÃ BANANA LIMÃO PIMENTA CHOCOLATE PIPOCA BOLO SOPA PIZZA
TEMPO SORTE VERDADE MENTIRA AMOR GUERRA PAZ OURO PRATA SOMBRA LUZ FORÇA PODER MAGIA SEGREDO CAOS DESTINO SONHO MEMÓRIA SILÊNCIO
TREM METRÔ BARCO SUBMARINO HELICÓPTERO BALÃO CARRO MOTO TANQUE NAVE AVIÃO BICICLETA ÔNIBUS DRONE LASER CÓDIGO VÍRUS REDE CHIP SATÉLITE RADAR
PLANETA GALÁXIA COMETA ÓRBITA GRAVIDADE CORRIDA SALTO MERGULHO VOO CAÇA PESCA LUTA DANÇA JOGO MISSÃO FUGA ARMADILHA DUELO BATALHA ATAQUE
BRASIL JAPÃO EGITO ROMA PARIS LONDRES ÁFRICA ÍNDIA MÉXICO CHINA ALPES AMAZÔNIA
CORAÇÃO CABEÇA MÃO OLHO DENTE BRAÇO PÉ OSSO SANGUE NARIZ BOCA CABELO
PIANO VIOLÃO TAMBOR FLAUTA ÓPERA BANDA RÁDIO DISCO MICROFONE
VERDE AZUL VERMELHO PRETO BRANCO ROSA DOURADO
TEIA NINHO OVO CONCHA PENA GARRA ASA CHIFRE CAUDA
FILME ESTÁTUA PINTURA FOTO TELA PALCO MÁSCARA FANTASIA CIRCO
LUVA BOTA CINTO GRAVATA ÓCULOS COLAR CAPA VESTIDO PIJAMA
BOLSA MALA TENDA CAMA SOFÁ MESA CADEIRA JANELA PORTA PAREDE TELHADO CHAMINÉ
NOTA PAPEL LÁPIS TINTA QUADRO RÉGUA PROVA AULA
CÉU INFERNO PARAÍSO NORTE SUL LESTE OESTE CENTRO PONTO LINHA CÍRCULO CRUZ`.split(/\s+/).filter(Boolean))];

const CN = { name: store.get('name'), code: '', error: '', loading: false, clue: '', count: 1, marks: {}, markGame: -1 };
const cnRoom = new Room('cn', 'cn');
const CN_T = { r: { name: 'Vermelho', emoji: '🔴' }, b: { name: 'Azul', emoji: '🔵' } };
const cnOther = t => t === 'r' ? 'b' : 'r';
cnRoom.onChange = d => { if (d.game !== CN.markGame) { CN.marks = {}; CN.markGame = d.game; } if (G.page === 'cn-room') render(); };
cnRoom.onGone = msg => { toast(msg); clearLast(); go('hub'); };

function cnGenCards(first) {
  const words = shuffle(CN_WORDS).slice(0, 25);
  const types = shuffle([...Array(9).fill(first), ...Array(8).fill(cnOther(first)), 'x', ...Array(7).fill('n')]);
  const cards = {}; words.forEach((w, i) => cards[i] = { w, t: types[i], rv: false });
  return cards;
}
function cnLeft(d, t) { return Object.values(d.cards || {}).filter(c => c && c.t === t && !c.rv).length; }

// ── Entrada ──────────────────────────────────────────────────────────
PAGES['cn-home'] = () => homeScreen({
  sv: 'CN', S: CN, icon: '🔐', title: 'Codinomes',
  sub: 'Dois times, 25 palavras e um Espião Chefe em cada time. Encontre seus agentes antes do outro time — e fuja do assassino!',
  create: 'cnCreate()', join: 'cnJoin()',
  rules: `<p><b>Times:</b> 🔴 Vermelho e 🔵 Azul. Cada time tem um <b>🕵️ Espião Chefe</b> e um ou mais <b>🕴️ Agentes</b>.</p>
  <p><b>Espião Chefe</b> vê as cores de todas as cartas e dá uma pista: <b>uma palavra + um número</b> (quantas cartas ela conecta). Ele pode tocar nas cartas para marcá-las (só ele vê) enquanto pensa.</p>
  <p><b>Agentes</b> tocam nas cartas que acham ser do seu time. Acertou? Pode continuar (até número + 1 tentativas). Errou? A vez passa.</p>
  <p>💀 <b>Assassino:</b> quem revelar perde na hora! O time que começa tem 9 cartas, o outro 8. Quem achar todas primeiro vence.</p>
  <p><b>∞ Infinito:</b> o espião pode dar uma pista sem limite de tentativas (útil para recuperar pistas antigas).</p>`
});
function cnCreate() {
  doHome(CN, cnRoom, 'create', () => { const f = rand(['r', 'b']); return { first: f, turn: f, clue: null, winner: null, reason: null, game: 1, cards: cnGenCards(f) }; }, {}, 'cn-room');
}
function cnJoin() { doHome(CN, cnRoom, 'join', null, {}, 'cn-room'); }
async function cnLeave() { await cnRoom.leave(); clearLast(); go('hub'); }

PAGES['cn-room'] = () => {
  const d = cnRoom.data; if (!d) return loadingScreen();
  if (d.phase === 'lobby') rCnLobby(d); else rCnGame(d);
};

// ── Lobby ────────────────────────────────────────────────────────────
function cnTeam(t) { return cnRoom.players().filter(([, p]) => p.team === t); }
function cnSpy(t) { const s = cnTeam(t).find(([, p]) => p.role === 'spy'); return s ? s[0] : null; }
function cnMember(n, ic = '') {
  const p = cnRoom.p(n);
  return `<div class="cn-member ${p.online ? '' : 'offline'}">${avatar(n, 26)}<span class="nm">${ic}${esc(n)}${n === cnRoom.me ? ' <span class="badge you">você</span>' : ''}</span>
  ${cnRoom.isHost && n !== cnRoom.me && cnRoom.data?.phase === 'lobby' ? `<button class="kick" onclick="cnRoom.kick(${jsq(n)})">✕</button>` : ''}</div>`;
}
async function cnSlot(t, role) {
  const sp = cnSpy(t);
  if (role === 'spy' && sp && sp !== cnRoom.me) return toast(`${sp} já é o Espião Chefe desse time`, 'err');
  await cnRoom.ref.child('players/' + cnRoom.me).update({ team: t, role });
}
async function cnRandomTeams() {
  const on = shuffle(cnRoom.onlineNames()), upd = {};
  cnRoom.names().forEach(n => { upd[`players/${n}/team`] = null; upd[`players/${n}/role`] = null; });
  on.forEach((n, i) => { upd[`players/${n}/team`] = i % 2 ? 'b' : 'r'; upd[`players/${n}/role`] = i < 2 ? 'spy' : 'op'; });
  await cnRoom.update(upd);
}
function cnValidate() {
  for (const t of ['r', 'b']) {
    const mem = cnTeam(t).filter(([, p]) => p.online);
    if (!mem.some(([, p]) => p.role === 'spy')) return `O time ${CN_T[t].name} precisa de um Espião Chefe!`;
    if (!mem.some(([, p]) => p.role === 'op')) return `O time ${CN_T[t].name} precisa de pelo menos 1 Agente!`;
  }
  return null;
}
function cnLogKey() { return cnRoom.ref.child('log').push().key; }
async function cnStart() {
  const err = cnValidate(); if (err) return toast(err, 'err');
  const d = cnRoom.data;
  await cnRoom.update({ phase: 'play', turn: d.first, clue: null, winner: null, reason: null, ['log/' + cnLogKey()]: { k: 'start', team: d.first, ts: TS } });
}

function rCnLobby(d) {
  const me = cnRoom.me, my = cnRoom.p(me), h = cnRoom.isHost;
  const spect = cnRoom.players().filter(([, p]) => !p.team);
  const col = t => {
    const T = CN_T[t], sp = cnSpy(t), ops = cnTeam(t).filter(([, p]) => p.role !== 'spy');
    return `<div class="cn-team-col t-${t}">
      <div class="cn-team-head">${T.emoji} Time ${T.name}<span class="small">${d.first === t ? '9 cartas · começa' : '8 cartas'}</span></div>
      <div class="cn-slot-lbl">🕵️ Espião Chefe</div>
      ${sp ? cnMember(sp) : `<button class="slot-btn" onclick="cnSlot('${t}','spy')">+ Ser o Espião Chefe</button>`}
      <div class="cn-slot-lbl">🕴️ Agentes</div>
      ${ops.map(([n]) => cnMember(n)).join('')}
      ${my.team === t && my.role === 'op' ? '' : `<button class="slot-btn" onclick="cnSlot('${t}','op')">+ Entrar como Agente</button>`}
    </div>`;
  };
  paint(page(`${roomCodeBox(cnRoom)}
  <div class="section-title">Escolha seu time e papel</div>
  <div class="cn-teams">${col('r')}${col('b')}</div>
  ${spect.length ? `<div class="section-title">👀 Sem time (${spect.length})</div><div class="player-list compact">${spect.map(([n]) => playerRow(cnRoom, 'cnRoom', n)).join('')}</div>` : ''}
  ${h ? `<button class="btn btn-secondary" onclick="cnRandomTeams()">🎲 Sortear times</button><button class="btn btn-primary" onclick="cnStart()">🎮 Iniciar partida</button>`
      : '<div class="status">O host inicia a partida quando os times estiverem prontos<span class="dots"></span></div>'}`, 'cnLeave()'));
}

// ── Jogo ─────────────────────────────────────────────────────────────
function cnClick(i) {
  const d = cnRoom.data, my = cnRoom.p(cnRoom.me), c = d.cards?.[i];
  if (!c || c.rv || d.phase !== 'play') return;
  if (my.role === 'spy') { CN.marks[i] = !CN.marks[i]; render(); return; }
  cnGuess(i);
}
async function cnGuess(i) {
  const d = cnRoom.data, me = cnRoom.me, my = cnRoom.p(me);
  if (d.phase !== 'play' || !d.clue || my.role !== 'op' || my.team !== d.turn) return;
  const c = d.cards[i]; if (!c || c.rv) return;
  const tx = await cnRoom.ref.child('cards/' + i + '/rv').transaction(v => v ? undefined : true);
  if (!tx.committed) return;
  const d2 = cnRoom.data || d, team = d.turn, other = cnOther(team);
  const cards = Object.values(d2.cards || {}).map((x, k) => String(k) === String(i) ? { ...x, rv: true } : x);
  const rLeft = cards.filter(x => x && x.t === 'r' && !x.rv).length, bLeft = cards.filter(x => x && x.t === 'b' && !x.rv).length;
  const upd = { [`cards/${i}/by`]: me, ['log/' + cnLogKey()]: { k: 'guess', team, who: me, word: c.w, t: c.t, ts: TS } };
  if (c.t === 'x') Object.assign(upd, { phase: 'ended', winner: other, reason: 'assassin', clue: null });
  else if (rLeft === 0 || bLeft === 0) Object.assign(upd, { phase: 'ended', winner: rLeft === 0 ? 'r' : 'b', reason: 'cards', clue: null });
  else if (c.t !== team) Object.assign(upd, { turn: other, clue: null });
  else {
    const left = d2.clue?.left ?? 1;
    if (left >= 0) { if (left - 1 <= 0) Object.assign(upd, { turn: other, clue: null }); else upd['clue/left'] = left - 1; }
  }
  await cnRoom.update(upd);
}
async function cnGiveClue() {
  const d = cnRoom.data, me = cnRoom.me, my = cnRoom.p(me);
  if (d.phase !== 'play' || d.clue || my.role !== 'spy' || my.team !== d.turn) return;
  const w = CN.clue.trim().toUpperCase();
  if (!w) return toast('Digite a pista!', 'err');
  if (/\s/.test(w)) return toast('A pista deve ser uma única palavra!', 'err');
  if (Object.values(d.cards).some(c => c && !c.rv && norm(c.w) === norm(w))) return toast('A pista não pode ser uma palavra do tabuleiro!', 'err');
  const inf = CN.count === 'inf', n = inf ? 'inf' : (Number(CN.count) || 1);
  await cnRoom.update({ clue: { word: w, count: n, left: inf ? -1 : n + 1, team: d.turn }, ['log/' + cnLogKey()]: { k: 'clue', team: d.turn, who: me, word: w, count: n, ts: TS } });
  CN.clue = ''; CN.count = 1; render();
}
async function cnPass() {
  const d = cnRoom.data, my = cnRoom.p(cnRoom.me);
  if (d.phase !== 'play' || !d.clue || my.role !== 'op' || my.team !== d.turn) return;
  await cnRoom.update({ turn: cnOther(d.turn), clue: null, ['log/' + cnLogKey()]: { k: 'pass', team: d.turn, who: cnRoom.me, ts: TS } });
}
async function cnRematch(toLobby) {
  const d = cnRoom.data, f = rand(['r', 'b']);
  const upd = { first: f, turn: f, clue: null, winner: null, reason: null, game: (d.game || 1) + 1, cards: cnGenCards(f), log: null, phase: 'lobby' };
  if (!toLobby && !cnValidate()) { upd.phase = 'play'; upd['log'] = { [cnLogKey()]: { k: 'start', team: f, ts: TS } }; }
  else if (!toLobby) toast('Os times precisam ser ajustados', 'err');
  await cnRoom.update(upd);
}

function cnLogHtml(d) {
  const items = Object.entries(d.log || {}).sort((a, b) => a[0] < b[0] ? -1 : 1).map(([, e]) => e).reverse();
  if (!items.length) return '<div class="muted small" style="padding:8px">Nada ainda.</div>';
  return items.map(e => {
    const T = CN_T[e.team] || {};
    if (e.k === 'start') return `<div class="log-item sys">🎬 Partida iniciada — ${T.emoji} ${T.name} começa</div>`;
    if (e.k === 'clue') return `<div class="log-item clue t-${e.team}"><span>🕵️ <b>${esc(e.who)}</b> deu a pista</span><span class="log-clue">${esc(e.word)} · ${e.count === 'inf' ? '∞' : e.count}</span></div>`;
    if (e.k === 'pass') return `<div class="log-item t-${e.team}">⏭️ <b>${esc(e.who)}</b> passou a vez</div>`;
    if (e.k === 'guess') {
      const ok = e.t === e.team;
      const what = e.t === 'x' ? '💀 ASSASSINO!' : e.t === 'n' ? 'neutra' : ok ? 'acertou!' : `do time ${CN_T[e.t].name}`;
      return `<div class="log-item t-${e.team} ${ok ? 'good' : 'bad'}"><span class="log-ic">${ok ? '✅' : e.t === 'x' ? '💀' : '❌'}</span>
        <span><b>${esc(e.who)}</b> escolheu <span class="log-card c-${e.t}">${esc(e.word)}</span> <span class="muted">(${what})</span></span></div>`;
    }
    return '';
  }).join('');
}
function cnTeamsSide(d) {
  return ['r', 'b'].map(t => {
    const T = CN_T[t], mem = cnTeam(t);
    return `<div class="side-team t-${t} ${d.turn === t && d.phase === 'play' ? 'turn' : ''}"><div class="side-team-head">${T.emoji} ${T.name} <b>${cnLeft(d, t)}</b></div>
      ${mem.map(([n, p]) => `<div class="side-mem ${p.online ? '' : 'offline'}">${p.role === 'spy' ? '🕵️' : '🕴️'} ${esc(n)}${n === cnRoom.me ? ' (você)' : ''}</div>`).join('')}</div>`;
  }).join('');
}

function rCnGame(d) {
  const me = cnRoom.me, my = cnRoom.p(me), isSpy = my.role === 'spy', ended = d.phase === 'ended';
  const turn = d.turn, T = CN_T[turn], myTurn = my.team === turn;
  const canGuess = !ended && myTurn && my.role === 'op' && !!d.clue;
  const showAll = isSpy || ended;
  const spyName = cnSpy(turn);
  const board = Object.entries(d.cards || {}).map(([i, c]) => {
    if (!c) return '';
    let cls = 'cn-card';
    if (c.rv) cls += ' rv c-' + c.t;
    else if (showAll) cls += ' spy c-' + c.t;
    else cls += ' hidden';
    if (!c.rv && !ended && (canGuess || isSpy)) cls += ' clickable';
    if (isSpy && !c.rv && !ended && CN.marks[i]) cls += ' marked';
    return `<div class="${cls}" onclick="cnClick(${i})"><span class="w">${esc(c.w)}</span>${c.rv && c.by ? `<span class="by">${esc(c.by)}</span>` : ''}${c.rv && c.t === 'x' ? '<span class="skull">💀</span>' : ''}</div>`;
  }).join('');

  let status, action = '';
  if (ended) {
    const W = CN_T[d.winner];
    status = `<div class="cn-banner t-${d.winner}">🏆 Time ${W.name} venceu!<small>${d.reason === 'assassin' ? `O time ${CN_T[cnOther(d.winner)].name} encontrou o assassino 💀` : 'Encontrou todos os seus agentes!'}</small></div>`;
    action = cnRoom.isHost ? `<div class="row"><button class="btn btn-primary" onclick="cnRematch(false)">🔄 Nova partida</button><button class="btn btn-secondary" onclick="cnRematch(true)">👥 Trocar times</button></div>`
      : '<div class="status">Aguardando o host começar outra partida<span class="dots"></span></div>';
  } else if (!d.clue) {
    status = `<div class="cn-turn t-${turn}">${T.emoji} Vez do ${T.name} — ${isSpy && myTurn ? '<b>dê a sua pista!</b>' : `🕵️ ${esc(spyName || 'Espião')} está pensando na pista<span class="dots"></span>`}</div>`;
    if (isSpy && myTurn) {
      const marked = Object.keys(CN.marks).filter(k => CN.marks[k] && !d.cards[k]?.rv).length;
      action = `<div class="cn-panel">
        <div class="panel-title">Sua pista</div>
        <div class="small muted" style="margin-bottom:8px">💡 Toque nas cartas para marcá-las (só você vê). ${marked ? `<b>${marked} marcada(s)</b> · <button class="link-btn inline" onclick="CN.marks={};render()">limpar</button>` : ''}</div>
        <input class="input" id="cn-clue" maxlength="25" placeholder="Uma palavra..." style="text-transform:uppercase" value="${esc(CN.clue)}" oninput="CN.clue=this.value" onkeydown="if(event.key==='Enter')cnGiveClue()" autocomplete="off">
        <div class="count-chips">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'inf'].map(n => `<button class="cchip ${String(CN.count) === String(n) || (!CN.count && n === 1) ? 'active' : ''}" onclick="CN.count=${n === 'inf' ? "'inf'" : n};render()">${n === 'inf' ? '∞' : n}</button>`).join('')}</div>
        <button class="btn btn-primary" onclick="cnGiveClue()">✅ Dar pista${marked && CN.count !== 'inf' && Number(CN.count) !== marked ? '' : ''}</button></div>`;
    }
  } else {
    const c = d.clue;
    status = `<div class="cn-turn t-${turn}">${T.emoji} ${T.name} adivinhando${myTurn && !isSpy ? ' — <b>sua vez!</b>' : ''}</div>`;
    action = `<div class="cn-clue-display t-${turn}"><div class="eyebrow">Pista</div><div class="cn-clue-word">${esc(c.word)} <span>${c.count === 'inf' ? '∞' : c.count}</span></div>
      <div class="small muted">${c.left < 0 ? 'Tentativas ilimitadas' : `${c.left} tentativa(s) restante(s)`}</div>
      ${canGuess ? `<button class="btn btn-secondary btn-sm" style="margin-top:10px" onclick="cnPass()">⏭️ Encerrar a vez</button>` : ''}</div>`;
  }
  const roleTag = my.team ? `${CN_T[my.team].emoji} ${isSpy ? '🕵️ Espião Chefe' : '🕴️ Agente'}` : '👀 Espectador';
  const spyHint = isSpy && !ended && !(myTurn && !d.clue) ? `<div class="small muted center" style="margin-top:6px">💡 Toque nas cartas para marcá-las (só você vê)${Object.values(CN.marks).some(Boolean) ? ' · <button class="link-btn inline" onclick="CN.marks={};render()">limpar marcações</button>' : ''}</div>` : '';

  paint(`<div class="page cn-page"><div class="cn-wrap">
    <div class="cn-main">
      <div class="cn-top"><button class="back" onclick="cnLeave()">← Sair</button>
        <div class="cn-score"><span class="sr">🔴 ${cnLeft(d, 'r')}</span><span class="muted small">restantes</span><span class="sb">${cnLeft(d, 'b')} 🔵</span></div>
        <div class="cn-role t-${my.team || 'n'}">${roleTag}</div></div>
      ${status}
      <div class="cn-board ${isSpy ? 'spyview' : ''}">${board}</div>
      ${spyHint}
      ${action}
    </div>
    <aside class="cn-side">
      <div class="side-box">${cnTeamsSide(d)}</div>
      <div class="side-box"><div class="side-title">📜 Histórico</div><div class="cn-log">${cnLogHtml(d)}</div></div>
    </aside>
  </div></div>`);
}
