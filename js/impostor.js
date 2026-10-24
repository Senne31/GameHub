'use strict';
// ═══════════════════════════════════════════════════════════════════
//  QUEM É O IMPOSTOR?
// ═══════════════════════════════════════════════════════════════════
// words: modo "impostor sabe" · pairs: modo "impostor não sabe" (palavras parecidas, mas distinguíveis)
const THEMES = [
  { id: 1, cat: "🍕 Comida",
    words: ["Pizza","Sushi","Hambúrguer","Macarrão","Frango","Bife","Salada","Sopa","Arroz","Feijão","Pão","Queijo","Ovo","Batata frita","Peixe","Camarão","Bacon","Torta","Bolo","Biscoito","Iogurte","Chocolate","Sorvete","Pipoca","Cachorro-quente","Crepe","Tapioca","Açaí","Pamonha","Coxinha","Pastel","Esfirra","Brigadeiro","Pudim","Pão de queijo","Lasanha","Strogonoff","Churros","Waffle","Panqueca","Yakisoba","Temaki","Ramen","Taco","Burrito","Croissant","Brownie","Cookie","Cheesecake","Feijoada","Churrasco","Donuts","Melancia","Banana","Morango","Abacaxi"],
    pairs: [["Pizza","Esfirra"],["Hambúrguer","Cachorro-quente"],["Sushi","Temaki"],["Lasanha","Macarrão"],["Coxinha","Pastel"],["Brigadeiro","Beijinho"],["Sorvete","Açaí"],["Pudim","Mousse"],["Panqueca","Crepe"],["Bolo","Torta"],["Pão de queijo","Biscoito de polvilho"],["Tapioca","Cuscuz"],["Churros","Donuts"],["Strogonoff","Fricassê"],["Feijoada","Feijão tropeiro"],["Batata frita","Mandioca frita"],["Cookie","Brownie"],["Risoto","Paella"],["Taco","Burrito"],["Morango","Cereja"],["Melancia","Melão"],["Café","Chocolate quente"]] },
  { id: 2, cat: "🐾 Animais",
    words: ["Cachorro","Gato","Leão","Elefante","Cobra","Macaco","Cavalo","Vaca","Galinha","Porco","Papagaio","Tartaruga","Coelho","Pinguim","Girafa","Hipopótamo","Crocodilo","Tigre","Urso","Lobo","Raposa","Rato","Águia","Tubarão","Polvo","Borboleta","Abelha","Formiga","Aranha","Sapo","Pato","Golfinho","Baleia","Canguru","Coala","Panda","Zebra","Flamingo","Camelo","Capivara","Tamanduá","Onça","Preguiça","Morcego","Coruja","Tucano","Pavão","Avestruz","Foca","Caranguejo"],
    pairs: [["Cachorro","Lobo"],["Gato","Leão"],["Tigre","Onça"],["Cavalo","Zebra"],["Jacaré","Crocodilo"],["Golfinho","Tubarão"],["Pato","Ganso"],["Coelho","Lebre"],["Rato","Hamster"],["Coruja","Águia"],["Papagaio","Arara"],["Abelha","Vespa"],["Tartaruga","Jabuti"],["Camelo","Lhama"],["Macaco","Gorila"],["Urso","Panda"],["Sapo","Rã"],["Borboleta","Mariposa"],["Foca","Morsa"],["Galinha","Peru"],["Baleia","Golfinho"],["Ovelha","Cabra"]] },
  { id: 3, cat: "⚽ Esportes",
    words: ["Futebol","Basquete","Vôlei","Natação","Tênis","Boxe","Judô","Ciclismo","Ginástica","Golfe","Rugby","Handebol","Surfe","Skate","Corrida","Mergulho","Badminton","Esgrima","Caratê","Taekwondo","Maratona","Hipismo","Hóquei","Beisebol","Crossfit","Yoga","Escalada","Snowboard","Ski","Canoagem","Capoeira","Patinação","Arco e flecha","Futebol americano","Sinuca","Boliche","Dardos","MMA","Jiu-jitsu","Sumô","Polo aquático","Pingue-pongue"],
    pairs: [["Futebol","Futsal"],["Vôlei","Vôlei de praia"],["Tênis","Badminton"],["Boxe","MMA"],["Judô","Jiu-jitsu"],["Surfe","Skate"],["Basquete","Handebol"],["Natação","Polo aquático"],["Ciclismo","Triatlo"],["Corrida","Maratona"],["Rugby","Futebol americano"],["Ski","Snowboard"],["Caratê","Taekwondo"],["Sinuca","Boliche"],["Hóquei","Patinação"],["Tênis","Pingue-pongue"],["Yoga","Pilates"],["Escalada","Rapel"]] },
  { id: 4, cat: "🌍 Países",
    words: ["Brasil","EUA","China","Japão","França","Alemanha","Itália","Espanha","México","Argentina","Rússia","Canadá","Austrália","Índia","Portugal","Holanda","Suécia","Noruega","Turquia","Egito","Marrocos","Tailândia","Coreia do Sul","Cuba","Peru","Chile","Colômbia","Uruguai","Grécia","Israel","Nigéria","África do Sul","Jamaica","Suíça","Inglaterra","Irlanda","Nova Zelândia","Islândia","Havaí"],
    pairs: [["Brasil","Portugal"],["Argentina","Uruguai"],["EUA","Canadá"],["França","Itália"],["Espanha","México"],["Japão","China"],["Alemanha","Áustria"],["Inglaterra","Irlanda"],["Suécia","Noruega"],["Egito","Marrocos"],["Índia","Paquistão"],["Austrália","Nova Zelândia"],["Grécia","Turquia"],["Rússia","Ucrânia"],["Chile","Peru"],["Holanda","Bélgica"],["Cuba","Jamaica"],["Coreia do Sul","Japão"],["Suíça","Áustria"]] },
  { id: 5, cat: "🎬 Filmes e Séries",
    words: ["Comédia","Terror","Ação","Drama","Romance","Animação","Documentário","Ficção científica","Aventura","Suspense","Musical","Fantasia","Guerra","Super-herói","Zumbi","Vampiro","Faroeste","Policial","Anime","Novela","Reality show","Sitcom","Pirata","Alien","Robô","Viagem no tempo","Dinossauro","Princesa","Mago","Espião","Detetive","Sereia","Lobisomem","Fantasma"],
    pairs: [["Terror","Suspense"],["Comédia","Comédia romântica"],["Ação","Aventura"],["Drama","Romance"],["Animação","Anime"],["Ficção científica","Fantasia"],["Zumbi","Vampiro"],["Faroeste","Filme de guerra"],["Policial","Detetive"],["Super-herói","Espião"],["Documentário","Biografia"],["Novela","Série"],["Pirata","Viking"],["Alien","Robô"],["Sitcom","Reality show"],["Mago","Bruxa"],["Lobisomem","Vampiro"],["Princesa","Rainha"]] },
  { id: 6, cat: "🎵 Música",
    words: ["Violão","Guitarra","Piano","Bateria","Flauta","Violino","Saxofone","Trompete","Baixo","Teclado","Rock","Samba","Funk","Jazz","Pop","MPB","Reggae","Hip-hop","Forró","Pagode","Axé","Sertanejo","Metal","Blues","Gospel","Rap","Eletrônica","Bossa nova","K-pop","Pandeiro","Microfone","DJ","Karaokê","Show","Ópera","Orquestra","Coral","Fone de ouvido"],
    pairs: [["Violão","Guitarra"],["Piano","Teclado"],["Violino","Violoncelo"],["Flauta","Clarinete"],["Saxofone","Trompete"],["Bateria","Pandeiro"],["Samba","Pagode"],["Funk","Rap"],["Rock","Metal"],["Sertanejo","Forró"],["MPB","Bossa nova"],["Pop","K-pop"],["Jazz","Blues"],["Reggae","Ska"],["Show","Festival"],["Ópera","Musical"],["Orquestra","Banda"],["DJ","Produtor musical"]] },
  { id: 7, cat: "🏠 Casa",
    words: ["Sofá","Mesa","Cadeira","Cama","Geladeira","Fogão","Televisão","Janela","Porta","Armário","Espelho","Tapete","Cortina","Lâmpada","Ventilador","Micro-ondas","Liquidificador","Banheiro","Cozinha","Garagem","Varanda","Jardim","Piscina","Escada","Cafeteira","Aspirador","Vassoura","Balde","Estante","Aquário","Pia","Chuveiro","Chave","Campainha","Martelo","Travesseiro","Cobertor","Controle remoto"],
    pairs: [["Sofá","Poltrona"],["Cama","Beliche"],["Geladeira","Freezer"],["Fogão","Forno"],["Micro-ondas","Air fryer"],["Mesa","Escrivaninha"],["Cadeira","Banquinho"],["Cortina","Persiana"],["Tapete","Capacho"],["Armário","Guarda-roupa"],["Chuveiro","Banheira"],["Vassoura","Rodo"],["Ventilador","Ar-condicionado"],["Lâmpada","Abajur"],["Travesseiro","Almofada"],["Cobertor","Lençol"],["Varanda","Quintal"],["Liquidificador","Batedeira"]] },
  { id: 8, cat: "📱 Tecnologia",
    words: ["Celular","Computador","Tablet","Notebook","Fone de ouvido","Câmera","Impressora","Roteador","Pendrive","Mouse","Teclado","Monitor","Webcam","Smartwatch","Drone","Netflix","Instagram","YouTube","WhatsApp","Spotify","TikTok","Google","ChatGPT","Bitcoin","Wi-fi","Bluetooth","GPS","Videogame","Robô","Realidade virtual","Carregador","Selfie","Emoji","Senha","Vírus de computador"],
    pairs: [["Celular","Tablet"],["Notebook","Computador"],["Fone de ouvido","Caixa de som"],["WhatsApp","Telegram"],["Instagram","TikTok"],["YouTube","Netflix"],["Mouse","Teclado"],["Wi-fi","Bluetooth"],["Pendrive","HD externo"],["Smartwatch","Relógio"],["Impressora","Scanner"],["Câmera","Webcam"],["ChatGPT","Google"],["PlayStation","Xbox"],["Spotify","Rádio"],["Selfie","Foto"],["Emoji","Figurinha"]] },
  { id: 9, cat: "🎉 Festas",
    words: ["Aniversário","Casamento","Formatura","Natal","Carnaval","Réveillon","Páscoa","Festa junina","Halloween","Churrasco","Piquenique","Balada","Karaokê","Bolo","Vela","Parabéns","Confete","Balão","Fogos de artifício","Brinde","Convite","Decoração","Fantasia","Máscara","DJ","Fogueira","Quadrilha","Amigo secreto","Presente","Papai Noel","Chá de bebê","Open bar","Pista de dança"],
    pairs: [["Aniversário","Chá de bebê"],["Casamento","Noivado"],["Natal","Ano-novo"],["Carnaval","Micareta"],["Festa junina","Quermesse"],["Halloween","Dia dos mortos"],["Churrasco","Piquenique"],["Balada","Show"],["Formatura","Baile"],["Páscoa","Dia das crianças"],["Balão","Confete"],["Cerveja","Chopp"],["Champanhe","Vinho"],["Fogos de artifício","Fogueira"],["Fantasia","Máscara"],["Amigo secreto","Amigo da onça"]] },
  { id: 10, cat: "🎮 Games",
    words: ["Minecraft","Fortnite","Roblox","GTA","Mario","Zelda","Pokémon","FIFA","Free Fire","Valorant","Among Us","Fall Guys","Call of Duty","League of Legends","Tetris","Pac-Man","Sonic","Street Fighter","Mortal Kombat","Resident Evil","The Sims","God of War","Clash Royale","Candy Crush","Subway Surfers","Counter-Strike","Stardew Valley","Elden Ring","Overcooked","Just Dance","Guitar Hero","Angry Birds","Crash Bandicoot","Kirby"],
    pairs: [["Minecraft","Terraria"],["Fortnite","Free Fire"],["Mario","Sonic"],["Pokémon","Digimon"],["FIFA","PES"],["GTA","Red Dead Redemption"],["Call of Duty","Battlefield"],["Valorant","Counter-Strike"],["League of Legends","Dota"],["Tetris","Candy Crush"],["Street Fighter","Mortal Kombat"],["The Sims","Stardew Valley"],["Resident Evil","Silent Hill"],["Clash Royale","Clash of Clans"],["Subway Surfers","Temple Run"],["Among Us","Fall Guys"],["Just Dance","Guitar Hero"],["Crash Bandicoot","Spyro"]] },
  { id: 11, cat: "👷 Profissões",
    words: ["Médico","Enfermeiro","Dentista","Veterinário","Professor","Policial","Bombeiro","Advogado","Juiz","Engenheiro","Arquiteto","Pedreiro","Eletricista","Encanador","Cozinheiro","Garçom","Padeiro","Piloto","Motorista","Carteiro","Jornalista","Fotógrafo","Ator","Cantor","Palhaço","Mágico","Astronauta","Cientista","Programador","Cabeleireiro","Jardineiro","Fazendeiro","Pescador","Detetive","Youtuber","Psicólogo","Mecânico","Salva-vidas","Faxineiro","Segurança"],
    pairs: [["Médico","Enfermeiro"],["Policial","Detetive"],["Bombeiro","Salva-vidas"],["Advogado","Juiz"],["Engenheiro","Arquiteto"],["Pedreiro","Pintor"],["Eletricista","Encanador"],["Cozinheiro","Padeiro"],["Garçom","Barman"],["Piloto","Comissário de bordo"],["Cabeleireiro","Barbeiro"],["Ator","Cantor"],["Palhaço","Mágico"],["Youtuber","Streamer"],["Veterinário","Dentista"],["Psicólogo","Terapeuta"],["Fazendeiro","Jardineiro"],["Professor","Diretor de escola"]] },
  { id: 12, cat: "📍 Lugares",
    words: ["Praia","Shopping","Escola","Hospital","Aeroporto","Rodoviária","Cinema","Teatro","Museu","Biblioteca","Academia","Igreja","Supermercado","Padaria","Farmácia","Banco","Parque","Zoológico","Circo","Estádio","Piscina","Hotel","Restaurante","Bar","Delegacia","Prisão","Fazenda","Floresta","Deserto","Montanha","Cachoeira","Ilha","Castelo","Cemitério","Metrô","Posto de gasolina","Parque de diversões","Navio","Camping","Spa"],
    pairs: [["Praia","Piscina"],["Shopping","Supermercado"],["Escola","Faculdade"],["Hospital","Farmácia"],["Aeroporto","Rodoviária"],["Cinema","Teatro"],["Museu","Biblioteca"],["Parque","Praça"],["Zoológico","Aquário"],["Circo","Parque de diversões"],["Hotel","Pousada"],["Restaurante","Lanchonete"],["Bar","Balada"],["Delegacia","Prisão"],["Fazenda","Sítio"],["Floresta","Selva"],["Montanha","Vulcão"],["Castelo","Palácio"],["Padaria","Confeitaria"],["Academia","Spa"]] },
];
const themeOf = d => THEMES.find(t => t.id === d.themeId);

const IMP = { name: store.get('name'), code: '', error: '', loading: false, reveal: false, clue: '', guess: '', key: '', peek: false, fk: '' };
const impRoom = new Room('imp', 'imp');
const impAuto = autoRunner(impAutoFn);
impRoom.onChange = d => {
  const k = d.phase + '|' + (d.game || 0) + '|' + (d.clueRound || 0);
  if (k !== IMP.key) { IMP.key = k; IMP.reveal = false; IMP.peek = false; }
  impAuto();
  if (G.page === 'imp-room') render();
};
impRoom.onGone = msg => { toast(msg); clearLast(); go('hub'); };

// ── Entrada ──────────────────────────────────────────────────────────
PAGES['imp-home'] = () => homeScreen({
  sv: 'IMP', S: IMP, icon: '🕵️', title: 'Quem é o Impostor?',
  sub: 'Todos recebem a mesma palavra... menos um. Deem dicas, desconfiem e descubram o impostor!',
  create: 'impCreate()', join: 'impJoin()',
  rules: `<p><b>1.</b> Todos recebem uma palavra secreta do mesmo tema — menos o impostor.</p>
  <p><b>2.</b> Em cada rodada, cada jogador diz <b>uma palavra</b> relacionada à sua palavra secreta (sem entregá-la!).</p>
  <p><b>3.</b> Depois de cada rodada, o grupo decide: <b>votar agora</b> ou <b>mais uma rodada</b> (máximo de 3).</p>
  <p><b>4.</b> Na votação, todos apontam quem acham que é o impostor.</p>
  <p><b>Modos:</b> 🎭 <i>Impostor sabe</i> — o impostor só vê o tema e precisa blefar. 🙈 <i>Impostor não sabe</i> — o impostor recebe uma palavra parecida e nem sabe que é o impostor!</p>
  <p><b>Pontos:</b> impostor pego → todos do grupo +1 (quem votou nele +1 extra). Impostor escapa → impostor +3. No modo "sabe", o impostor pego pode adivinhar a palavra e ganhar +3.</p>`
});
function impCreate() { doHome(IMP, impRoom, 'create', () => ({ mode: 'knows', themeSel: 'rand', game: 0, scores: {} }), {}, 'imp-room'); }
function impJoin() { doHome(IMP, impRoom, 'join', null, {}, 'imp-room'); }
async function impLeave() { await impRoom.leave(); clearLast(); go('hub'); }

PAGES['imp-room'] = () => {
  const d = impRoom.data; if (!d) return loadingScreen();
  ({ lobby: rImpLobby, word: rImpWord, clues: rImpClues, decide: rImpDecide, voting: rImpVote, results: rImpResults }[d.phase] || rImpLobby)(d);
};

// ── Ações do host ────────────────────────────────────────────────────
async function impSet(k, v) { if (impRoom.isHost) await impRoom.update({ [k]: v }); }

async function impStart() {
  const d = impRoom.data, on = impRoom.onlineNames();
  if (on.length < 3) return toast('Precisa de pelo menos 3 jogadores!', 'err');
  const t = d.themeSel && d.themeSel !== 'rand' ? THEMES.find(x => String(x.id) === String(d.themeSel)) || rand(THEMES) : rand(THEMES);
  const imp = rand(on);
  let word, impWord = null;
  if (d.mode === 'blind') { const p = shuffle(rand(t.pairs)); word = p[0]; impWord = p[1]; }
  else word = rand(t.words);
  const order = shuffle(on);
  if (d.mode !== 'blind' && order[0] === imp) order.push(order.shift()); // impostor que sabe não começa
  const upd = { phase: 'word', themeId: t.id, word, impWord, impostorName: imp, order, turn: 0, clueRound: 1, clues: null, result: null, game: (d.game || 0) + 1 };
  impRoom.names().forEach(n => { ['ready', 'vote', 'decision', 'guess'].forEach(f => upd[`players/${n}/${f}`] = null); });
  await impRoom.update(upd);
}
async function impToClues() { await impRoom.update({ phase: 'clues', turn: 0, clueRound: 1 }); }
async function impSubmitClue(name, text) {
  const d = impRoom.data; if (!d || d.phase !== 'clues' || d.order[d.turn] !== name) return;
  const upd = { [`clues/${d.clueRound}/${name}`]: text };
  if (d.turn + 1 < d.order.length) upd.turn = d.turn + 1;
  else if (d.clueRound >= 3) upd.phase = 'voting';
  else { upd.phase = 'decide'; d.order.forEach(n => upd[`players/${n}/decision`] = null); }
  await impRoom.update(upd);
}
async function impGoVote() { const d = impRoom.data; const upd = { phase: 'voting' }; d.order.forEach(n => upd[`players/${n}/vote`] = null); await impRoom.update(upd); }
async function impNextRound() {
  const d = impRoom.data; if (d.clueRound >= 3) return impGoVote();
  const upd = { phase: 'clues', turn: 0, clueRound: d.clueRound + 1 };
  d.order.forEach(n => upd[`players/${n}/decision`] = null);
  await impRoom.update(upd);
}
async function impResult() {
  const d = impRoom.data; if (d.phase !== 'voting') return;
  const order = d.order || [], counts = {}, votes = {};
  order.forEach(n => { const v = impRoom.p(n).vote; if (v) { votes[n] = v; counts[v] = (counts[v] || 0) + 1; } });
  let top = 0, elim = null, tie = false;
  for (const [n, c] of Object.entries(counts)) { if (c > top) { top = c; elim = n; tie = false; } else if (c === top) tie = true; }
  if (tie) elim = null;
  const imp = d.impostorName, caught = !!elim && elim === imp;
  const sc = { ...(d.scores || {}) }; order.forEach(n => { if (sc[n] == null) sc[n] = 0; });
  if (caught) order.forEach(n => { if (n !== imp) sc[n] += votes[n] === imp ? 2 : 1; });
  else sc[imp] = (sc[imp] || 0) + 3;
  await impRoom.update({ phase: 'results', scores: sc, result: { caught, eliminated: elim, tie, counts, votes } });
}
async function impToLobby() { await impRoom.update({ phase: 'lobby' }); }

// Automação: só o host executa (se ele cair, outro assume)
async function impAutoFn() {
  const d = impRoom.data; if (!d || !impRoom.isHost) return;
  const on = impRoom.onlineNames(), order = d.order || [], inG = order.filter(n => on.includes(n)), P = n => impRoom.p(n);
  if (d.phase === 'word') { if (inG.length && inG.every(n => P(n).ready)) await impToClues(); }
  else if (d.phase === 'clues') { const cur = order[d.turn]; if (cur && !on.includes(cur)) await impSubmitClue(cur, '💤 (ausente)'); }
  else if (d.phase === 'decide') {
    if (inG.length && inG.every(n => P(n).decision)) {
      const v = inG.filter(n => P(n).decision === 'vote').length;
      if (v > inG.length - v) await impGoVote(); else await impNextRound();
    }
  }
  else if (d.phase === 'voting') { if (inG.length && inG.every(n => P(n).vote)) await impResult(); }
  else if (d.phase === 'results' && d.mode !== 'blind' && d.result?.caught && d.result.guess == null) {
    const g = P(d.impostorName).guess;
    if (g) {
      const ok = norm(g) === norm(d.word), sc = { ...(d.scores || {}) };
      if (ok) sc[d.impostorName] = (sc[d.impostorName] || 0) + 3;
      await impRoom.update({ 'result/guess': g, 'result/guessOk': ok, scores: sc });
    }
  }
}

// ── Ações do jogador ─────────────────────────────────────────────────
async function impReady() { await impRoom.ref.child(`players/${impRoom.me}/ready`).set(true); }
function impSendClue(text) {
  const t = String(text || IMP.clue || '').trim().slice(0, 30);
  if (!t) return toast('Digite sua palavra!', 'err');
  IMP.clue = ''; impSubmitClue(impRoom.me, t);
}
function impSkip() { const d = impRoom.data; impSubmitClue(d.order[d.turn], '⏭️ (pulou)'); }
async function impDecide(x) { await impRoom.ref.child(`players/${impRoom.me}/decision`).set(x); }
async function impVote(n) { if (n === impRoom.me) return; await impRoom.ref.child(`players/${impRoom.me}/vote`).set(n); }
async function impSendGuess() {
  const g = IMP.guess.trim(); if (!g) return toast('Digite seu palpite!', 'err');
  IMP.guess = ''; await impRoom.ref.child(`players/${impRoom.me}/guess`).set(g.slice(0, 40));
}

// ── Componentes ──────────────────────────────────────────────────────
function impMy(d) {
  const isImp = impRoom.me === d.impostorName, t = themeOf(d);
  if (d.mode === 'blind') return { isImp, knows: false, word: isImp ? d.impWord : d.word, t };
  return { isImp, knows: isImp, word: isImp ? null : d.word, t };
}
function impWordCard(d) {
  const m = impMy(d);
  if (m.knows) return `<div class="word-card impostor"><div style="font-size:2.6rem">🎭</div>
    <div class="word-big" style="color:var(--red);font-size:1.6rem">Você é o IMPOSTOR!</div>
    <div class="muted" style="margin-top:8px">Tema: <b style="color:var(--text)">${esc(m.t?.cat || '')}</b></div>
    <div class="small muted" style="margin-top:8px;line-height:1.5">Ouça as dicas, descubra a palavra e não se entregue!</div></div>`;
  return `<div class="word-card"><div class="theme-lbl">${esc(m.t?.cat || '')}</div><div class="word-big">${esc(m.word)}</div></div>`;
}
function impPeek(d) {
  if (!(d.order || []).includes(impRoom.me)) return '';
  const m = impMy(d);
  return `<button class="peek" onclick="IMP.peek=!IMP.peek;render()">${IMP.peek
    ? (m.knows ? `🎭 Você é o impostor · Tema: <b>${esc(m.t?.cat)}</b>` : `🔑 Sua palavra: <b>${esc(m.word)}</b>`)
    : '👁️ Toque para lembrar sua palavra'}</button>`;
}
function impCluesTable(d, showImp = false) {
  const order = d.order || [], R = Math.max(1, d.clueRound || 1), cl = d.clues || {};
  const head = `<div class="clue-row head"><div>Jogador</div>${Array.from({ length: R }, (_, r) => `<div>Rodada ${r + 1}</div>`).join('')}</div>`;
  const rows = order.map((n, i) => {
    const cur = d.phase === 'clues' && i === d.turn, isI = showImp && n === d.impostorName;
    const cells = Array.from({ length: R }, (_, r) => {
      const v = cl[r + 1]?.[n];
      return `<div class="clue-cell">${v ? esc(v) : (cur && r + 1 === d.clueRound ? '<span class="typing">✍️</span>' : '<span class="muted">—</span>')}</div>`;
    }).join('');
    return `<div class="clue-row ${cur ? 'current' : ''} ${isI ? 'imp' : ''}"><div class="ct-name">${avatar(n, 24)}<span>${esc(n)}</span>${isI ? ' 🎭' : ''}</div>${cells}</div>`;
  }).join('');
  return `<div class="clue-table" style="--r:${R}">${head}${rows}</div>`;
}

// ── Telas ────────────────────────────────────────────────────────────
function rImpLobby(d) {
  const h = impRoom.isHost, on = impRoom.onlineNames(), names = impRoom.names(), sel = String(d.themeSel || 'rand');
  const chips = [['rand', '🎲 Aleatório'], ...THEMES.map(t => [String(t.id), t.cat])];
  paint(page(`${roomCodeBox(impRoom)}
  <div class="section-title">⚙️ Configurações ${h ? '' : '<span class="muted small">(o host escolhe)</span>'}</div>
  <div class="lbl">Modo de jogo</div>
  <div class="seg">
    <button class="seg-btn ${d.mode !== 'blind' ? 'active' : ''}" ${h ? `onclick="impSet('mode','knows')"` : 'disabled'}><b>🎭 Impostor sabe</b><span>O impostor sabe que é ele e só vê o tema</span></button>
    <button class="seg-btn ${d.mode === 'blind' ? 'active' : ''}" ${h ? `onclick="impSet('mode','blind')"` : 'disabled'}><b>🙈 Impostor não sabe</b><span>Recebe uma palavra parecida e nem sabe que é o impostor</span></button>
  </div>
  <div class="lbl">Tema</div>
  <div class="chips">${chips.map(([id, l]) => `<button class="chip ${sel === id ? 'active' : ''}" ${h ? `onclick="impSet('themeSel',${jsq(id)})"` : 'disabled'}>${l}</button>`).join('')}</div>
  <div class="section-title">👥 Jogadores (${on.length})</div>
  <div class="player-list">${names.map(n => playerRow(impRoom, 'impRoom', n, d.scores?.[n] ? `<span class="badge">${d.scores[n]} pts</span>` : '')).join('')}</div>
  ${h ? `<button class="btn btn-primary" onclick="impStart()" ${on.length < 3 ? 'disabled' : ''}>${on.length >= 3 ? '🎮 Iniciar partida' : 'Precisa de pelo menos 3 jogadores'}</button>`
      : `<div class="status">Aguardando o host iniciar<span class="dots"></span></div>`}`, 'impLeave()'));
}

function rImpWord(d) {
  const order = d.order || [], me = impRoom.me, playing = order.includes(me), ready = impRoom.p(me).ready;
  const rc = order.filter(n => impRoom.p(n).ready).length;
  let main;
  if (!playing) main = '<div class="info">Você está assistindo esta partida. Entre na próxima!</div>';
  else if (IMP.reveal) main = impWordCard(d) + (ready
    ? `<div class="status">✅ Pronto! Aguardando os outros (${rc}/${order.length})<span class="dots"></span></div>`
    : `<button class="btn btn-primary" onclick="impReady()">✅ Já vi, estou pronto!</button>`)
    + `<button class="btn btn-ghost" onclick="IMP.reveal=false;render()">🙈 Esconder</button>`;
  else main = `<div class="word-card tap" onclick="IMP.reveal=true;render()"><div style="font-size:2.6rem">👁️</div><div class="bold" style="margin-top:8px">Toque para ver sua palavra</div><div class="muted small" style="margin-top:6px">Garanta que ninguém está olhando!</div></div>`;
  paint(page(`
  <div class="phase-head"><div class="eyebrow">Partida ${d.game} · ${d.mode === 'blind' ? '🙈 Impostor não sabe' : '🎭 Impostor sabe'}</div><div class="h2">Veja sua palavra em segredo</div></div>
  ${main}
  <div class="section-title">Ordem de fala</div>
  <div class="player-list compact">${order.map((n, i) => playerRow(impRoom, 'impRoom', n, `<span class="badge ${impRoom.p(n).ready ? 'ready' : ''}">${impRoom.p(n).ready ? '✅ pronto' : '⏳ vendo'}</span>`).replace('<div class="avatar"', `<span class="order-n">${i + 1}</span><div class="avatar"`)).join('')}</div>
  ${impRoom.isHost ? hostPanel(`<button class="btn btn-secondary btn-sm" onclick="impToClues()">▶️ Começar as rodadas agora</button>`) : ''}`, 'impLeave()'));
}

function rImpClues(d) {
  const order = d.order || [], cur = order[d.turn], me = impRoom.me, myTurn = cur === me;
  paint(page(`
  <div class="phase-head"><div class="eyebrow">Rodada ${d.clueRound} de 3 · ${esc(themeOf(d)?.cat || '')}</div><div class="h2">💬 Cada um diz uma palavra</div>
  <div class="muted small">Dê uma dica sobre sua palavra sem entregá-la!</div></div>
  ${impPeek(d)}
  ${impCluesTable(d)}
  ${myTurn ? `<div class="turn-box mine"><div class="bold" style="margin-bottom:10px">🎤 Sua vez! Diga uma palavra:</div>
      <div class="row"><input class="input" id="imp-clue" maxlength="30" placeholder="Sua dica" value="${esc(IMP.clue)}" oninput="IMP.clue=this.value" onkeydown="if(event.key==='Enter')impSendClue()" autocomplete="off">
      <button class="btn btn-primary btn-inline" onclick="impSendClue()">Enviar</button></div>
      <button class="link-btn" onclick="impSendClue('🗣️ (falou em voz)')">Já falei em voz alta na chamada</button></div>`
    : `<div class="turn-box"><div class="row center">${avatar(cur, 30)}<span>Vez de <b>${esc(cur)}</b> falar<span class="dots"></span></span></div></div>`}
  ${impRoom.isHost && !myTurn ? hostPanel(`<button class="btn btn-secondary btn-sm" onclick="impSkip()">⏭️ Pular a vez de ${esc(cur)}</button>`) : ''}`, 'impLeave()'));
  const fk = d.game + '-' + d.clueRound + '-' + d.turn;
  if (myTurn && IMP.fk !== fk) { IMP.fk = fk; setTimeout(() => $('imp-clue')?.focus(), 40); }
}

function rImpDecide(d) {
  const order = d.order || [], on = impRoom.onlineNames(), inG = order.filter(n => on.includes(n)), me = impRoom.me;
  const my = impRoom.p(me).decision, playing = order.includes(me);
  const v = inG.filter(n => impRoom.p(n).decision === 'vote').length, c = inG.filter(n => impRoom.p(n).decision === 'more').length;
  paint(page(`
  <div class="phase-head"><div class="eyebrow">Fim da rodada ${d.clueRound} de 3</div><div class="h2">🤔 E agora?</div>
  <div class="muted small">Já dá para descobrir o impostor ou querem mais uma rodada de dicas?</div></div>
  ${impPeek(d)}
  ${impCluesTable(d)}
  ${playing ? `<div class="two-btns">
    <button class="big-choice ${my === 'vote' ? 'active' : ''}" onclick="impDecide('vote')"><span class="bc-ic">🗳️</span>Ir para a votação<small>${v} voto(s)</small></button>
    <button class="big-choice ${my === 'more' ? 'active' : ''}" onclick="impDecide('more')"><span class="bc-ic">🔁</span>${d.clueRound === 2 ? 'Última rodada' : 'Mais uma rodada'}<small>${c} voto(s)</small></button></div>` : ''}
  <div class="status">${v + c}/${inG.length} decidiram${v + c < inG.length ? '<span class="dots"></span>' : ''} · empate = mais uma rodada</div>
  ${impRoom.isHost ? hostPanel(`<div class="row"><button class="btn btn-secondary btn-sm" onclick="impGoVote()">🗳️ Votar agora</button><button class="btn btn-secondary btn-sm" onclick="impNextRound()">🔁 Nova rodada</button></div>`) : ''}`, 'impLeave()'));
}

function rImpVote(d) {
  const order = d.order || [], on = impRoom.onlineNames(), inG = order.filter(n => on.includes(n)), me = impRoom.me;
  const myVote = impRoom.p(me).vote, playing = order.includes(me), voted = inG.filter(n => impRoom.p(n).vote).length;
  paint(page(`
  <div class="phase-head"><div class="eyebrow">Votação</div><div class="h2">🗳️ Quem é o impostor?</div><div class="muted small">${voted}/${inG.length} votaram</div></div>
  ${impPeek(d)}
  <div class="vote-grid">${order.map(n => {
    const isMe = n === me, sel = myVote === n, hv = !!impRoom.p(n).vote;
    return `<button class="vote-card ${sel ? 'selected' : ''} ${isMe ? 'no-vote' : ''}" ${isMe || !playing ? 'disabled' : `onclick="impVote(${jsq(n)})"`}>
      ${avatar(n, 46)}<div class="bold" style="margin-top:6px">${esc(n)}</div>
      ${isMe ? '<div class="small muted">você</div>' : ''}<div class="small ${hv ? 'ok' : 'muted'}">${hv ? '✓ votou' : 'pensando...'}</div></button>`;
  }).join('')}</div>
  ${myVote ? `<div class="status">Você votou em <b>${esc(myVote)}</b> — pode trocar até todos votarem</div>` : ''}
  <div class="section-title">📜 Dicas dadas</div>
  ${impCluesTable(d)}
  ${impRoom.isHost ? hostPanel(`<button class="btn btn-secondary btn-sm" onclick="impResult()">🔍 Encerrar votação e revelar</button>`) : ''}`, 'impLeave()'));
}

function rImpResults(d) {
  const r = d.result || {}, me = impRoom.me, imp = d.impostorName, isImp = me === imp, caught = r.caught, t = themeOf(d), blind = d.mode === 'blind';
  const sorted = Object.entries(d.scores || {}).sort((a, b) => b[1] - a[1]);
  const canGuess = !blind && isImp && caught && r.guess == null && !impRoom.p(me).guess;
  const waitGuess = !blind && caught && r.guess == null;
  const title = caught ? (isImp ? 'Você foi pego!' : 'Impostor capturado!') : (isImp ? 'Você escapou!' : 'O impostor escapou!');
  const emoji = caught ? (isImp ? '😵' : '🎉') : (isImp ? '😈' : '😱');
  const sub = caught ? `<b>${esc(imp)}</b> era o impostor` : r.eliminated ? `Vocês votaram em <b>${esc(r.eliminated)}</b>, mas o impostor era <b>${esc(imp)}</b>` : `Empate na votação! O impostor era <b>${esc(imp)}</b>`;
  const votes = Object.entries(r.votes || {});
  paint(page(`
  <div class="result-banner ${caught ? 'caught' : 'escaped'}"><div class="result-emoji">${emoji}</div><div class="result-title">${title}</div><div class="result-sub">${sub}</div></div>
  ${blind ? `<div class="two-words"><div class="word-reveal-box"><div class="eyebrow">Palavra do grupo</div><div class="h2">${esc(d.word)}</div></div>
      <div class="word-reveal-box imp"><div class="eyebrow">Palavra do impostor</div><div class="h2">${esc(d.impWord)}</div></div></div>`
    : `<div class="word-reveal-box"><div class="eyebrow">A palavra era</div><div class="h2">${esc(d.word)}</div><div class="muted small">${esc(t?.cat || '')}</div></div>`}
  ${r.guess != null ? `<div class="word-reveal-box"><div class="eyebrow">Palpite do impostor</div><div class="bold" style="font-size:1.15rem;color:${r.guessOk ? 'var(--green)' : 'var(--red)'}">"${esc(r.guess)}" ${r.guessOk ? '✅ Acertou! +3 pts' : '❌ Errou'}</div></div>` : ''}
  ${canGuess ? `<div class="host-panel" style="border-color:var(--red)"><div class="host-panel-title" style="color:var(--red)">🎭 Última chance! Adivinhe a palavra (+3 pts)</div>
      <div class="row"><input class="input" id="imp-guess" placeholder="Qual era a palavra?" value="${esc(IMP.guess)}" oninput="IMP.guess=this.value" onkeydown="if(event.key==='Enter')impSendGuess()" autocomplete="off">
      <button class="btn btn-danger btn-inline" onclick="impSendGuess()">Chutar</button></div></div>`
    : waitGuess && !isImp ? `<div class="status">🎭 O impostor tem uma chance de adivinhar a palavra<span class="dots"></span></div>` : ''}
  ${votes.length ? `<div class="section-title">🗳️ Votos</div><div class="votes-list">${votes.map(([a, b]) => `<div class="vote-line">${avatar(a, 22)}<span>${esc(a)}</span><span class="muted">→</span>${avatar(b, 22)}<span class="${b === imp ? 'ok' : ''}">${esc(b)}</span></div>`).join('')}</div>` : ''}
  <div class="section-title">📜 Dicas</div>
  ${impCluesTable(d, true)}
  <div class="section-title">🏆 Placar</div>
  <div class="scores-list">${sorted.map(([n, pts], i) => `<div class="score-row"><div class="row" style="gap:9px"><span class="muted" style="width:18px">${i + 1}</span>${avatar(n, 28)}<span>${esc(n)}</span>${n === imp ? '<span class="badge imp">impostor</span>' : ''}</div><div class="score-pts">${pts} pts</div></div>`).join('')}</div>
  ${impRoom.isHost ? `<button class="btn btn-primary" onclick="impStart()">🔄 Próxima partida</button><button class="btn btn-secondary" onclick="impToLobby()">⚙️ Mudar tema/modo</button>`
      : `<div class="status">Aguardando o host iniciar a próxima partida<span class="dots"></span></div>`}`, 'impLeave()'));
}
