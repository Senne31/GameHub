'use strict';
// ═══════════════════════════════════════════════════════════════════
//  GameHub — núcleo compartilhado (Firebase, salas, utilidades, UI)
// ═══════════════════════════════════════════════════════════════════

firebase.initializeApp({
  apiKey: "AIzaSyDVeUZ9OtiBfahh4OT2StwGFy9W8eMNb28",
  authDomain: "gamehub-bb2e3.firebaseapp.com",
  databaseURL: "https://gamehub-bb2e3-default-rtdb.firebaseio.com",
  projectId: "gamehub-bb2e3",
  storageBucket: "gamehub-bb2e3.firebasestorage.app",
  messagingSenderId: "1009976797910",
  appId: "1:1009976797910:web:36563365c5e698910fb777"
});
const db = firebase.database();
const TS = firebase.database.ServerValue.TIMESTAMP;

// Relógio sincronizado com o servidor (timers iguais para todos)
let serverOffset = 0;
db.ref('.info/serverTimeOffset').on('value', s => { serverOffset = s.val() || 0; });
const now = () => Date.now() + serverOffset;

// ── Utilidades ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const rand = a => a[Math.floor(Math.random() * a.length)];
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function randCode() { const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; let s = ''; for (let i = 0; i < 4; i++) s += rand(L); return s; }
function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function jsq(s) { return esc(JSON.stringify(String(s))); } // string segura dentro de onclick="..."
function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim(); }
function cleanName(s) { return String(s || '').replace(/[.#$\[\]\/\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 18); }
function fmtTime(sec) { const m = Math.floor(sec / 60), s = sec % 60; return m + ':' + String(s).padStart(2, '0'); }
function withTimeout(p, ms = 12000) { return Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms))]); }

const AV_COLORS = ['#7c4dff', '#00b8d4', '#ff4081', '#00c853', '#ff9100', '#2979ff', '#d500f9', '#64dd17', '#ff5252', '#ffab00', '#1de9b6', '#f50057'];
const AV_EMOJIS = ['😀', '😎', '🤠', '🧐', '🤩', '😏', '🤔', '😤', '🥸', '🤪', '😈', '👻', '🤖', '🎃', '🦊', '🐯', '🦁', '🐸', '🐧', '🦄', '🐼', '🐙', '🦉', '🐵'];
function hash(n) { let h = 7; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
const aC = n => AV_COLORS[hash(n) % AV_COLORS.length];
const aE = n => AV_EMOJIS[hash(n + '#') % AV_EMOJIS.length];
function avatar(n, size = 36) { return `<div class="avatar" style="background:${aC(n)};width:${size}px;height:${size}px;font-size:${Math.round(size * .55)}px">${aE(n)}</div>`; }

const store = {
  get(k, d = '') { try { return localStorage.getItem('gh_' + k) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('gh_' + k, v); } catch (e) { } }
};

let toastT;
function toast(msg, type = '') { const t = $('toast'); if (!t) return; t.textContent = msg; t.className = 'show ' + type; clearTimeout(toastT); toastT = setTimeout(() => t.className = '', 2800); }

// Executa uma automação do host sem sobreposição (re-executa se houver mudanças no meio)
function autoRunner(fn) {
  let busy = false, again = false;
  const run = async () => {
    if (busy) { again = true; return; }
    busy = true;
    try { await fn(); } catch (e) { console.error(e); }
    finally { busy = false; if (again) { again = false; setTimeout(run, 60); } }
  };
  return run;
}

// ── Renderização (preserva foco/cursor dos inputs) ───────────────────
const app = $('app');
function paint(html) {
  const a = document.activeElement; let f = null;
  if (a && a.id && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) f = { id: a.id, s: a.selectionStart, e: a.selectionEnd };
  app.innerHTML = html;
  if (f) { const el = $(f.id); if (el && !el.disabled) { el.focus(); try { el.setSelectionRange(f.s, f.e); } catch (e) { } } }
}

const G = { page: 'hub' };
const PAGES = {};
function render() { (PAGES[G.page] || PAGES.hub)(); }
function go(p) { G.page = p; render(); window.scrollTo(0, 0); }

// ── Sala multiplayer genérica ────────────────────────────────────────
// Jogadores nunca são apagados ao cair a conexão: ficam "offline" e podem voltar com o mesmo nome.
class Room {
  constructor(path, game) { this.path = path; this.game = game; this.onChange = null; this.onGone = null; this.reset(); }
  reset() { this.ref = null; this.code = ''; this.me = ''; this.data = null; this._h = null; this._c = null; this.extra = {}; }
  playerInit() { return { online: true, joinedAt: TS, ...this.extra }; }

  async create(name, init, extra = {}) {
    this.extra = extra;
    let code, ref;
    for (let i = 0; i < 8; i++) {
      code = randCode(); ref = db.ref(this.path + '/' + code);
      const s = await withTimeout(ref.child('phase').once('value'));
      if (!s.exists()) break;
    }
    await withTimeout(ref.set({ ...init, phase: 'lobby', hostName: name, createdAt: TS, players: { [name]: this.playerInit() } }));
    this._attach(code, ref, name);
  }

  async join(code, name, extra = {}) {
    this.extra = extra;
    const ref = db.ref(this.path + '/' + code);
    const snap = await withTimeout(ref.once('value'));
    if (!snap.exists()) return 'Sala não encontrada! Confira o código.';
    const d = snap.val(), p = d.players && d.players[name];
    if (p && p.joinedAt) {
      if (p.online) return 'Esse nome já está em uso nesta sala!';
      await withTimeout(ref.child('players/' + name + '/online').set(true)); // reconectando
    } else {
      if (d.phase !== 'lobby') return 'A partida já começou! Só quem já estava na sala pode voltar (com o mesmo nome).';
      await withTimeout(ref.child('players/' + name).set(this.playerInit()));
    }
    this._attach(code, ref, name);
    return null;
  }

  _attach(code, ref, name) {
    this.code = code; this.ref = ref; this.me = name;
    const on = ref.child('players/' + name + '/online');
    this._c = db.ref('.info/connected').on('value', s => {
      if (!s.val() || this.ref !== ref) return;
      on.onDisconnect().set(false);
      if (this.data && this.data.players && this.data.players[name]) on.set(true);
    });
    this._h = ref.on('value', s => {
      if (this.ref !== ref) return;
      const d = s.val();
      if (!d) return this._gone('A sala foi encerrada.');
      const p = d.players && d.players[name];
      if (!p || !p.joinedAt) return this._gone('Você foi removido da sala.');
      this.data = d;
      this.onChange && this.onChange(d);
    });
  }
  _detach() {
    if (this.ref) { this.ref.child('players/' + this.me + '/online').onDisconnect().cancel(); if (this._h) this.ref.off('value', this._h); }
    if (this._c) db.ref('.info/connected').off('value', this._c);
    this.reset();
  }
  _gone(msg) { this._detach(); this.onGone && this.onGone(msg); }

  async leave() {
    if (!this.ref) return;
    const ref = this.ref, me = this.me, d = this.data;
    this._detach();
    try {
      const others = Object.entries(d?.players || {}).filter(([n, p]) => n !== me && p && p.online && p.joinedAt);
      if (!others.length) await ref.remove();
      else if (d.phase === 'lobby') await ref.child('players/' + me).remove();
      else await ref.child('players/' + me + '/online').set(false);
    } catch (e) { }
  }

  players() { return Object.entries(this.data?.players || {}).filter(([, p]) => p && p.joinedAt).sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0)); }
  names() { return this.players().map(x => x[0]); }
  onlineNames() { return this.players().filter(([, p]) => p.online).map(x => x[0]); }
  p(n) { return this.data?.players?.[n] || {}; }
  host() { // se o host cair, o jogador mais antigo online assume automaticamente
    const d = this.data; if (!d) return null;
    if (d.players?.[d.hostName]?.online) return d.hostName;
    return this.onlineNames()[0] || d.hostName;
  }
  get isHost() { return !!this.ref && this.host() === this.me; }
  update(o) { return this.ref.update(o); }
  kick(n) { return this.ref.child('players/' + n).remove(); }
  link() { return location.origin + location.pathname + '?g=' + this.game + '&c=' + this.code; }
}

// ── Componentes de UI compartilhados ─────────────────────────────────
function loadingScreen() { paint(`<div class="connecting"><div class="spinner"></div><div>Conectando<span class="dots"></span></div></div>`); }
function page(inner, leave, cls = '') {
  return `<div class="page ${cls}"><div class="screen">${leave ? `<button class="back" onclick="${leave}">← Sair da sala</button>` : ''}${inner}</div></div>`;
}
function hostPanel(h) { return `<div class="host-panel"><div class="host-panel-title">👑 Controles do host</div>${h}</div>`; }
function roomCodeBox(room) {
  return `<div class="code-box"><div class="code-label">Código da sala</div><div class="code-big">${room.code}</div>
  <button class="btn btn-secondary btn-sm" onclick="copyInvite(${jsq(room.link())})">🔗 Copiar link de convite</button></div>`;
}
async function copyInvite(url) {
  if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) { try { await navigator.share({ title: 'GameHub', text: 'Bora jogar!', url }); return; } catch (e) { } }
  try { await navigator.clipboard.writeText(url); toast('Link copiado! Mande para os amigos 🎉'); } catch (e) { toast(url); }
}
function playerRow(room, rv, n, right = '') {
  const p = room.p(n), me = n === room.me, isH = n === room.host();
  return `<div class="player-row ${p.online ? '' : 'offline'}">${avatar(n)}
    <div class="player-name">${esc(n)}${me ? ' <span class="badge you">você</span>' : ''}${isH ? ' <span class="badge host">👑 host</span>' : ''}${p.online ? '' : ' <span class="badge">offline</span>'}</div>
    ${right}${room.isHost && !me && room.data?.phase === 'lobby' ? `<button class="kick" title="Remover da sala" onclick="${rv}.kick(${jsq(n)})">✕</button>` : ''}</div>`;
}

function homeScreen(c) {
  const S = c.S;
  paint(`<div class="page"><div class="screen">
  <button class="back" onclick="go('hub')">← Voltar</button>
  <div class="game-hero"><div class="hero-icon">${c.icon}</div><h1 class="title">${c.title}</h1><p class="subtitle">${c.sub}</p></div>
  ${S.error ? `<div class="alert">${esc(S.error)}</div>` : ''}
  <label class="lbl" for="${c.sv}-name">Seu nome</label>
  <input class="input" id="${c.sv}-name" maxlength="18" placeholder="Como quer ser chamado?" value="${esc(S.name)}" oninput="${c.sv}.name=this.value" autocomplete="off">
  <button class="btn ${S.code ? 'btn-secondary' : 'btn-primary'}" onclick="${c.create}" ${S.loading ? 'disabled' : ''}>${S.loading ? 'Conectando<span class="dots"></span>' : '✨ Criar nova sala'}</button>
  <div class="divider"><span>ou entre numa sala</span></div>
  <input class="input code-input" id="${c.sv}-code" maxlength="4" placeholder="CÓDIGO" value="${esc(S.code)}"
    oninput="this.value=this.value.toUpperCase().replace(/[^A-Z]/g,'');${c.sv}.code=this.value" onkeydown="if(event.key==='Enter')${c.join}" autocomplete="off">
  <button class="btn ${S.code ? 'btn-primary' : 'btn-secondary'}" onclick="${c.join}" ${S.loading ? 'disabled' : ''}>🚪 Entrar na sala</button>
  ${c.rules ? `<details class="rules"><summary>📖 Como jogar</summary><div class="rules-body">${c.rules}</div></details>` : ''}
  </div></div>`);
}

async function doHome(S, room, mode, init, extra, pageName) {
  const name = cleanName(S.name);
  if (!name) { S.error = 'Digite seu nome!'; render(); return; }
  S.name = name; store.set('name', name);
  let code = '';
  if (mode === 'join') { code = (S.code || '').toUpperCase(); if (code.length !== 4) { S.error = 'O código da sala tem 4 letras.'; render(); return; } }
  S.loading = true; S.error = ''; render();
  try {
    if (mode === 'create') await room.create(name, init(), extra);
    else { const err = await room.join(code, name, extra); if (err) { S.loading = false; S.error = err; render(); return; } }
    S.loading = false; S.error = ''; S.code = '';
    store.set('last', JSON.stringify({ g: room.game, c: room.code, n: name, t: Date.now() }));
    go(pageName);
  } catch (e) {
    console.error(e); S.loading = false;
    S.error = 'Não foi possível conectar. Verifique sua internet (ou as regras do Firebase).'; render();
  }
}
function clearLast() { store.set('last', ''); }
