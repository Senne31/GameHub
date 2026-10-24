'use strict';
// ═══════════════════════════════════════════════════════════════════
//  HUB + inicialização
// ═══════════════════════════════════════════════════════════════════
const GAMES = {
  imp: { S: () => IMP, join: () => impJoin(), title: 'Quem é o Impostor?' },
  cn: { S: () => CN, join: () => cnJoin(), title: 'Codinomes' },
  gp: { S: () => GP, join: () => gpJoin(), title: 'Gartic Phone' },
};
function lastRoom() {
  try { const l = JSON.parse(store.get('last') || 'null'); if (l && GAMES[l.g] && Date.now() - l.t < 6 * 3600e3) return l; } catch (e) { }
  return null;
}
function rejoin() {
  const l = lastRoom(); if (!l) return;
  const g = GAMES[l.g], S = g.S(); S.name = l.n; S.code = l.c; G.page = l.g + '-home'; g.join();
}

PAGES.hub = () => {
  const l = lastRoom();
  paint(`<div class="page hub"><div class="hub-header">
    <div class="hub-logo">🎮 GameHub</div>
    <div class="hub-sub">Jogos para jogar com os amigos — cada um no seu celular</div></div>
    ${l ? `<div class="rejoin"><div>🔌 Voltar para a sala <b>${esc(l.c)}</b> · ${esc(GAMES[l.g].title)} como <b>${esc(l.n)}</b>?</div>
      <div class="row"><button class="btn btn-primary btn-sm" onclick="rejoin()">Voltar</button><button class="btn btn-ghost btn-sm" onclick="clearLast();render()">✕</button></div></div>` : ''}
    <div class="games-grid">
      <button class="game-card live g-imp" onclick="go('imp-home')"><div class="card-icon">🕵️</div><div class="card-name">Quem é o Impostor?</div><div class="card-desc">Descubra quem não sabe a palavra</div><div class="card-meta">3+ jogadores</div></button>
      <button class="game-card live g-cn" onclick="go('cn-home')"><div class="card-icon">🔐</div><div class="card-name">Codinomes</div><div class="card-desc">Pistas, times e um assassino</div><div class="card-meta">4+ jogadores</div></button>
      <button class="game-card live g-gp" onclick="go('gp-home')"><div class="card-icon">🎨</div><div class="card-name">Gartic Phone</div><div class="card-desc">Telefone sem fio desenhado</div><div class="card-meta">3+ jogadores</div></button>
      <div class="game-card soon"><div class="soon-badge">Em breve</div><div class="card-icon">📝</div><div class="card-name">Quem Sou Eu?</div><div class="card-desc">Adivinhe o personagem na sua testa</div></div>
    </div></div>`);
};

(function boot() {
  const q = new URLSearchParams(location.search), g = q.get('g'), c = (q.get('c') || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  if (GAMES[g]) { const S = GAMES[g].S(); if (c) S.code = c; G.page = g + '-home'; history.replaceState(null, '', location.pathname); }
  render();
})();
