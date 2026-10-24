'use strict';
// ═══════════════════════════════════════════════════════════════════
//  GARTIC PHONE — telefone sem fio desenhado
//  Passo 0: escrever frase → 1: desenhar → 2: descrever → 3: desenhar ...
//  O álbum b no passo s fica com order[(b+s) % N]
// ═══════════════════════════════════════════════════════════════════
const GP_SPEEDS = {
  rapido: { label: '⚡ Rápido', w: 25, d: 60 },
  normal: { label: '⏱️ Normal', w: 45, d: 100 },
  lento: { label: '🐢 Lento', w: 70, d: 160 },
  livre: { label: '♾️ Sem tempo', w: 0, d: 0 },
};
const GP_THEMES = {
  livre: { label: '✍️ Livre', list: [] },
  animais: { label: '🐾 Animais', list: ["Um gato pilotando um avião", "Um cachorro de óculos escuros na praia", "Um elefante andando de skate", "Uma girafa presa no elevador", "Um pinguim tomando sorvete", "Um polvo tocando bateria", "Uma vaca na lua", "Um tubarão com medo de um peixinho", "Uma tartaruga ganhando uma corrida", "Um leão no salão de beleza", "Um macaco jogando videogame", "Uma galinha botando um ovo de ouro", "Um porco tomando banho de lama", "Um coelho saindo da cartola", "Uma coruja dando aula", "Um cavalo de pijama", "Um sapo virando príncipe", "Um urso pescando salmão", "Um camelo morrendo de sede no deserto", "Uma capivara relaxando na piscina"] },
  comida: { label: '🍕 Comida', list: ["Uma pizza voadora", "Um hambúrguer gigante atacando a cidade", "Uma banana escorregando", "Um sorvete derretendo no sol", "Um ovo frito tomando sol", "Um brigadeiro na festa de aniversário", "Uma melancia com óculos", "Um sushi fazendo karatê", "Um pão de queijo apaixonado", "Uma cenoura no dentista", "Um bolo de casamento enorme", "Uma pipoca estourando de susto", "Um cachorro-quente com cachorro de verdade", "Um abacaxi de coroa", "Uma xícara de café com sono", "Um churrasco na laje", "Uma coxinha de super-herói", "Um chocolate derretido no bolso", "Um macarrão infinito", "Uma batata frita dançando"] },
  profissoes: { label: '👷 Profissões', list: ["Um bombeiro salvando um gato da árvore", "Um dentista com medo de dente", "Um astronauta perdido no espaço", "Um chef de cozinha queimando a comida", "Um palhaço triste", "Um policial perseguindo um ladrão", "Um médico fazendo cirurgia em um ursinho", "Um pirata procurando tesouro", "Um mágico serrando uma pessoa", "Um professor dormindo na aula", "Um pescador pegando uma bota", "Um carteiro fugindo do cachorro", "Um jardineiro com uma planta carnívora", "Um cientista maluco", "Um youtuber gravando vídeo", "Um piloto de Fórmula 1", "Um detetive com lupa", "Um salva-vidas dormindo", "Um cabeleireiro fazendo moicano", "Um pedreiro construindo um castelo"] },
  objetos: { label: '📦 Objetos', list: ["Um guarda-chuva de cabeça para baixo", "Uma geladeira vazia", "Um relógio derretendo", "Uma televisão assistindo pessoas", "Um celular com a bateria acabando", "Uma escova de dentes cansada", "Uma lâmpada tendo uma ideia", "Uma vassoura voadora", "Um sofá engolindo controles remotos", "Uma mochila cheia de pedras", "Uma cadeira com três pernas", "Um despertador às 6 da manhã", "Um espelho mágico", "Uma bicicleta de quatro rodas", "Uma chave gigante", "Um balão subindo no céu", "Uma vela de aniversário que não apaga", "Um óculos de sol na neve", "Uma meia sem o par", "Um carrinho de supermercado desgovernado"] },
  filmes: { label: '🎬 Filmes', list: ["O Titanic afundando", "O Rei Leão", "Harry Potter na vassoura", "Homem-Aranha na teia", "Shrek no pântano", "Sabre de luz de Star Wars", "Procurando Nemo", "Toy Story", "Frozen: a Elsa fazendo gelo", "Jurassic Park", "Batman no telhado", "Piratas do Caribe", "Os Vingadores", "E.T. na bicicleta", "Tubarão atacando o barco", "Up: casa voando com balões", "Minions comendo banana", "Rapunzel na torre", "O Mágico de Oz", "King Kong no prédio"] },
  personagens: { label: '🦸 Personagens', list: ["Mario pulando no cano", "Pikachu dando choque", "Bob Esponja fazendo hambúrguer", "Mônica com o coelho Sansão", "Chaves no barril", "Papai Noel preso na chaminé", "Super-Homem voando", "Branca de Neve e a maçã", "Pinóquio com nariz enorme", "Goku virando Super Saiyajin", "Sonic correndo", "Scooby-Doo comendo sanduíche", "Saci-Pererê no redemoinho", "Chapeuzinho Vermelho e o lobo", "Darth Vader respirando", "Homem de Ferro voando", "Cinderela perdendo o sapato", "Patrick Estrela embaixo da pedra", "Pac-Man comendo fantasmas", "Mulher Maravilha com o laço"] },
  esportes: { label: '⚽ Esportes', list: ["Um gol de bicicleta", "Um goleiro voando", "Uma cesta de três pontos", "Um surfista numa onda gigante", "Um lutador de sumô", "Um skatista caindo", "Um nadador com boia", "Uma maratona de tartarugas", "Um tenista quebrando a raquete", "Um pódio olímpico", "Um jogador de vôlei cortando", "Um ciclista subindo a montanha", "Um boxeador com olho roxo", "Um juiz dando cartão vermelho", "Uma torcida fazendo ola", "Um esquiador descendo a montanha", "Um jogo de boliche com strike", "Um alpinista no topo do Everest", "Uma partida de xadrez", "Um cavalo pulando obstáculo"] },
  lugares: { label: '📍 Lugares', list: ["Uma praia lotada", "Uma casa mal-assombrada", "Uma ilha deserta com um coqueiro", "Um castelo nas nuvens", "Uma festa no espaço", "Um supermercado em promoção", "Um parque de diversões", "Um vulcão em erupção", "Uma cidade debaixo d'água", "Uma escola de magia", "Um iglu no Polo Norte", "Uma pirâmide no deserto", "Uma floresta encantada", "Um zoológico sem grades", "Um metrô lotado", "Um acampamento com fogueira", "O Cristo Redentor", "A Torre Eiffel", "Um aeroporto com voo atrasado", "Um circo pegando fogo"] },
  acoes: { label: '🤪 Ações engraçadas', list: ["Alguém escorregando no sabão", "Tropeçar na escada", "Dormir na aula", "Cantar no chuveiro", "Fugir de um cachorro", "Espirrar no meio de uma foto", "Perder o ônibus", "Queimar a pipoca", "Pisar num lego", "Dançar na chuva", "Comer pimenta muito forte", "Ficar preso no elevador", "Cair da cadeira", "Bater o dedinho na quina", "Esquecer a senha", "Tomar susto com uma barata", "Roncar muito alto", "Tirar uma selfie com um leão", "Chorar cortando cebola", "Tentar fazer uma estrela e cair"] },
  fantasia: { label: '🐉 Fantasia', list: ["Um dragão cuspindo fogo", "Uma bruxa na vassoura", "Um unicórnio no arco-íris", "Um mago com cajado", "Uma sereia cantando numa pedra", "Um gigante pisando numa casa", "Um fantasma assustado", "Um vampiro com medo de alho", "Uma fada pequenininha", "Um robô apaixonado", "Um alien abduzindo uma vaca", "Um zumbi na fila do pão", "Um cavaleiro lutando com um dragão", "Um portal para outro mundo", "Um tapete voador", "Um gênio saindo da lâmpada", "Um lobisomem na lua cheia", "Uma poção mágica borbulhando", "Um troll debaixo da ponte", "Um duende com pote de ouro"] },
  festas: { label: '🎉 Festas', list: ["Papai Noel na praia", "Uma abóbora de Halloween", "Um bloco de carnaval", "Uma fogueira de São João", "Um coelho da Páscoa escondendo ovos", "Fogos de artifício no Ano-Novo", "Um bolo de aniversário pegando fogo", "Uma quadrilha de festa junina", "Uma árvore de Natal caindo", "Um amigo secreto decepcionado", "Um casamento na montanha-russa", "Uma piñata explodindo doces", "Um karaokê desafinado", "Uma festa do pijama", "Um churrasco com chuva", "Uma rena de nariz vermelho", "Um peru de Natal fugindo", "Um trio elétrico", "Um chá de bebê", "Uma formatura com chapéus voando"] },
  brasil: { label: '🇧🇷 Brasil', list: ["Um churrasco na laje", "Um pão de queijo gigante", "O Cristo Redentor de braços abertos", "Um desfile de escola de samba", "Um jogo do Brasil na Copa", "Uma feijoada no domingo", "Um Saci com o gorro vermelho", "Um tucano na Amazônia", "Uma capivara no lago", "Um vendedor de mate na praia", "Uma roda de samba", "Um bolo de rolo", "Um açaí na tigela", "Um frevo com sombrinha", "Uma rede na varanda", "Um ônibus lotado no Rio", "Um boto cor-de-rosa", "Uma novela das nove", "Um mico-leão-dourado", "Um coco gelado na praia"] },
};
const GP_COLORS = ['#000000', '#555555', '#9e9e9e', '#ffffff', '#7a1f1f', '#e53935', '#ff7043', '#ffb300', '#fdd835', '#1b5e20', '#43a047', '#9ccc65', '#0d47a1', '#1e88e5', '#4fc3f7', '#4a148c', '#ab47bc', '#f48fb1', '#5d4037', '#a1887f', '#ffccaa', '#00897b'];
const GP_SIZES = [2, 5, 10, 18, 32];
const GP_TOOLS = [['pen', '✏️', 'Lápis (P)'], ['eraser', '🧽', 'Borracha (E)'], ['fill', '🪣', 'Balde de tinta (B)'], ['line', '📏', 'Linha (L)'], ['rect', '▭', 'Retângulo'], ['ellipse', '◯', 'Elipse'], ['rectf', '■', 'Retângulo cheio'], ['ellipsef', '●', 'Elipse cheia']];

const GP = { name: store.get('name'), code: '', error: '', loading: false, key: '', sugg: '', prevRef: null, prevH: null, albums: null, albRef: null, albH: null, albGame: -1, view: 0, tick: null, sent: '', adv: '', rvSig: '', endSig: '', keyAt: 0 };
const gpRoom = new Room('gp', 'gp');
const gpAuto = autoRunner(gpAutoFn);
gpRoom.onChange = () => { gpAuto(); if (G.page === 'gp-room') render(); };
gpRoom.onGone = msg => { gpCleanup(); toast(msg); clearLast(); go('hub'); };

const gpType = s => s === 0 ? 'write' : (s % 2 === 1 ? 'draw' : 'describe');
const gpBook = (idx, s, N) => ((idx - s) % N + N) % N;
const gpHolder = (order, b, s) => order[(b + s) % order.length];
function gpSuggest(theme) { const t = GP_THEMES[theme]; const all = t && t.list.length ? t.list : Object.values(GP_THEMES).flatMap(x => x.list); return rand(all); }
const gpBooksRef = (game) => db.ref(`gpb/${gpRoom.code}/${game}`);

// ── Entrada ──────────────────────────────────────────────────────────
PAGES['gp-home'] = () => homeScreen({
  sv: 'GP', S: GP, icon: '🎨', title: 'Gartic Phone',
  sub: 'O telefone sem fio desenhado! Escreva uma frase, desenhe a frase dos outros, descreva os desenhos... e veja o caos no final.',
  create: 'gpCreate()', join: 'gpJoin()',
  rules: `<p><b>1. Escreva</b> uma frase engraçada (ou use 🎲 para uma sugestão do tema).</p>
  <p><b>2. Desenhe</b> a frase que outro jogador escreveu.</p>
  <p><b>3. Descreva</b> o desenho que você recebeu — sem saber a frase original!</p>
  <p>Os passos se alternam até cada álbum passar por todos os jogadores. No final, o host apresenta os álbuns e todo mundo ri da confusão. Você pode baixar os álbuns como imagem!</p>
  <p><b>Ferramentas:</b> lápis, borracha, balde de tinta, linha, retângulo, elipse, 22 cores + cor personalizada, 5 espessuras, opacidade, desfazer (Ctrl+Z) e refazer (Ctrl+Y).</p>`
});
function gpCreate() { doHome(GP, gpRoom, 'create', () => ({ speed: 'normal', theme: 'livre', game: 0 }), {}, 'gp-room'); }
function gpJoin() { doHome(GP, gpRoom, 'join', null, {}, 'gp-room'); }
async function gpLeave() { gpCleanup(); await gpRoom.leave(); clearLast(); go('hub'); }

function gpDetachPrev() { if (GP.prevRef) { GP.prevRef.off('value', GP.prevH); GP.prevRef = null; } }
function gpDetachAlb() { if (GP.albRef) { GP.albRef.off('value', GP.albH); GP.albRef = null; } GP.albGame = -1; GP.albums = null; }
function gpCleanup() { gpDetachPrev(); gpDetachAlb(); clearInterval(GP.tick); GP.tick = null; GP.key = ''; D.c = null; }
function gpSetKey(k) { if (GP.key === k) return false; gpDetachPrev(); GP.key = k; GP.keyAt = Date.now(); D.c = null; GP.rvSig = ''; GP.endSig = ''; return true; }

PAGES['gp-room'] = () => {
  const d = gpRoom.data; if (!d) return loadingScreen();
  if (d.phase === 'lobby') { gpDetachAlb(); gpSetKey('lobby'); return rGpLobby(d); }
  if (d.phase === 'play') { gpDetachAlb(); return rGpPlay(d); }
  if (d.phase === 'reveal') return rGpReveal(d);
  if (d.phase === 'end') return rGpEnd(d);
};

// ── Lobby ────────────────────────────────────────────────────────────
async function gpSet(k, v) { if (gpRoom.isHost) await gpRoom.update({ [k]: v }); }
function rGpLobby(d) {
  const h = gpRoom.isHost, names = gpRoom.names(), on = gpRoom.onlineNames();
  paint(page(`${roomCodeBox(gpRoom)}
  <div class="section-title">👥 Jogadores (${on.length})</div>
  <div class="gp-lobby-grid">${names.map(n => {
    const p = gpRoom.p(n);
    return `<div class="gp-lobby-pl ${p.online ? '' : 'offline'}">${avatar(n, 54)}<div class="nm">${esc(n)}</div>
      ${n === gpRoom.host() ? '<div class="badge host">👑 host</div>' : ''}${n === gpRoom.me ? '<div class="badge you">você</div>' : ''}
      ${h && n !== gpRoom.me ? `<button class="kick" title="Remover" onclick="gpRoom.kick(${jsq(n)})">✕</button>` : ''}</div>`;
  }).join('')}</div>
  <div class="section-title">⚙️ Configurações ${h ? '' : '<span class="muted small">(o host escolhe)</span>'}</div>
  <div class="lbl">Velocidade</div>
  <div class="chips">${Object.entries(GP_SPEEDS).map(([k, v]) => `<button class="chip col ${d.speed === k ? 'active' : ''}" ${h ? `onclick="gpSet('speed','${k}')"` : 'disabled'}>${v.label}<small>${v.w ? `${v.w}s escrever · ${v.d}s desenhar` : 'avança quando todos terminam'}</small></button>`).join('')}</div>
  <div class="lbl">Tema das frases</div>
  <div class="chips">${Object.entries(GP_THEMES).map(([k, v]) => `<button class="chip ${d.theme === k ? 'active' : ''}" ${h ? `onclick="gpSet('theme','${k}')"` : 'disabled'}>${v.label}</button>`).join('')}</div>
  <div class="info small">🔁 Cada álbum passa por todos os jogadores: ${Math.max(on.length, 3)} passos (frase → desenho → descrição → desenho...).</div>
  ${h ? `<button class="btn btn-primary" onclick="gpStart()" ${on.length < 3 ? 'disabled' : ''}>${on.length >= 3 ? '🎨 Começar!' : 'Precisa de pelo menos 3 jogadores'}</button>`
      : '<div class="status">Aguardando o host começar<span class="dots"></span></div>'}`, 'gpLeave()'));
}
async function gpStart() {
  const d = gpRoom.data, on = gpRoom.onlineNames();
  if (on.length < 3) return toast('Precisa de pelo menos 3 jogadores!', 'err');
  const sp = GP_SPEEDS[d.speed] || GP_SPEEDS.normal, game = (d.game || 0) + 1;
  db.ref('gpb/' + gpRoom.code).remove().catch(() => { });
  GP.adv = '';
  await gpRoom.update({ phase: 'play', order: shuffle(on), step: 0, stepEnds: sp.w ? now() + sp.w * 1000 : 0, sub: null, reveal: null, game });
}

// ── Jogando ──────────────────────────────────────────────────────────
function gpDoneBtn() { return `<button class="btn btn-primary gp-done" id="gp-done" onclick="gpDone()">✅ Pronto!</button>`; }
function rGpPlay(d) {
  const k = `play-${d.game}-${d.step}`;
  if (!gpSetKey(k)) { gpUpdate(); return; }
  const me = gpRoom.me, order = d.order || [], N = order.length, s = d.step, type = gpType(s), idx = order.indexOf(me);
  if (idx < 0) { paint(page(`<div class="info">Uma partida está em andamento. Aguarde a próxima!</div>`, 'gpLeave()')); return; }
  const book = gpBook(idx, s, N);
  let body;
  if (type === 'write') {
    const themed = d.theme && d.theme !== 'livre';
    GP.sugg = gpSuggest(d.theme);
    body = `<div class="gp-card"><div class="gp-instr">✍️ Escreva uma frase para alguém desenhar</div>
      ${themed ? `<div class="small muted center">Tema: ${GP_THEMES[d.theme]?.label || ''}</div>` : '<div class="small muted center">Seja criativo! Sem ideias? Toque no 🎲</div>'}
      <div class="gp-text-row"><input class="input gp-input" id="gp-text" maxlength="100" placeholder="${esc(GP.sugg)}" value="${themed ? esc(GP.sugg) : ''}" autocomplete="off" onkeydown="if(event.key==='Enter')gpDone()">
      <button class="btn btn-secondary btn-inline" onclick="gpDice()" title="Sugestão aleatória">🎲</button></div>
      ${gpDoneBtn()}</div>`;
  } else if (type === 'draw') {
    body = `<div class="gp-prompt"><span class="gp-prompt-lbl">🖌️ Desenhe:</span><div id="gp-prev" class="gp-prev-text"><span class="dots"></span></div></div>${gpEditorHtml()}`;
  } else {
    body = `<div class="gp-card"><div class="gp-instr">🔍 O que é isso? Descreva o desenho</div>
      <div id="gp-prev" class="gp-prev-img"><div class="spinner"></div></div>
      <div class="gp-text-row"><input class="input gp-input" id="gp-text" maxlength="100" placeholder="Escreva o que você acha que é..." autocomplete="off" onkeydown="if(event.key==='Enter')gpDone()"></div>
      ${gpDoneBtn()}</div>`;
  }
  paint(`<div class="page gp-page"><div class="gp-wrap ${type === 'draw' ? 'wide' : ''}">
    <div class="gp-top"><button class="back" onclick="gpLeave()">← Sair</button>
      <div class="gp-step">${type === 'write' ? '✍️ Escrever' : type === 'draw' ? '🖌️ Desenhar' : '🔍 Descrever'} · passo ${s + 1}/${N}</div>
      <div class="gp-timer" id="gp-timer">⏱️</div></div>
    <div class="gp-progress"><i style="width:${(s / N) * 100}%"></i></div>
    <div id="gp-body" class="gp-body">${body}</div>
    <div class="gp-status" id="gp-status"></div>
  </div></div>`);
  if (type === 'draw') dInit();
  if (s > 0) gpWatchPrev(d, book, s - 1, type);
  else setTimeout(() => $('gp-text')?.focus(), 50);
  gpUpdate(); gpStartTick();
}
function gpDice() { const el = $('gp-text'); if (!el || el.disabled) return; GP.sugg = gpSuggest(gpRoom.data?.theme); el.value = GP.sugg; el.focus(); }
function gpWatchPrev(d, book, ps, type) {
  const ref = gpBooksRef(d.game).child(`${book}/${ps}`);
  GP.prevRef = ref;
  const show = e => {
    const el = $('gp-prev'); if (!el) return;
    if (!e || !e.v) {
      if (Date.now() - GP.keyAt < 5000) return; // ainda pode estar chegando
      el.innerHTML = type === 'draw' ? '<i class="muted">(O jogador anterior não escreveu nada — desenhe o que quiser!)</i>' : '<div class="muted" style="padding:30px">(Nenhum desenho recebido — escreva qualquer coisa!)</div>';
      return;
    }
    if (type === 'draw') el.textContent = e.v;
    else if (/^data:image\//.test(e.v)) el.innerHTML = `<img src="${esc(e.v)}" alt="desenho">`;
  };
  GP.prevH = ref.on('value', s => show(s.val()));
  setTimeout(() => { if (GP.prevRef === ref) ref.once('value', s => show(s.val())); }, 5200);
}
function gpLocked() { const d = gpRoom.data; return !!d?.sub?.[d.step]?.[gpRoom.me]; }
function gpUpdate() {
  const d = gpRoom.data; if (!d || d.phase !== 'play') return;
  const me = gpRoom.me, sub = d.sub?.[d.step] || {}, mine = !!sub[me], order = d.order || [];
  const done = order.filter(n => sub[n]).length;
  const st = $('gp-status');
  if (st) st.innerHTML = `<div class="gp-status-lbl">${done}/${order.length} prontos</div><div class="gp-status-list">${order.map(n => { const p = gpRoom.p(n); return `<div class="gp-pl ${sub[n] ? 'done' : ''} ${p.online ? '' : 'offline'}" title="${esc(n)}">${avatar(n, 30)}${sub[n] ? '<b class="ck">✓</b>' : ''}<span>${esc(n)}</span></div>`; }).join('')}</div>`;
  const b = $('gp-done');
  if (b) { b.textContent = mine ? '✏️ Editar' : '✅ Pronto!'; b.classList.toggle('btn-secondary', mine); b.classList.toggle('btn-primary', !mine); }
  $('gp-body')?.classList.toggle('locked', mine);
  const t = $('gp-text'); if (t) t.disabled = mine;
}
function gpStartTick() { if (!GP.tick) GP.tick = setInterval(gpTickFn, 300); }
function gpTickFn() {
  const d = gpRoom.data;
  if (!d || G.page !== 'gp-room' || d.phase !== 'play') { clearInterval(GP.tick); GP.tick = null; return; }
  const el = $('gp-timer');
  if (d.stepEnds) {
    const rem = Math.max(0, Math.ceil((d.stepEnds - now()) / 1000));
    if (el) { el.textContent = '⏱️ ' + fmtTime(rem); el.classList.toggle('urgent', rem <= 10); }
    if (rem <= 0) {
      const k = d.game + '-' + d.step;
      if (!d.sub?.[d.step]?.[gpRoom.me] && GP.sent !== k && (d.order || []).includes(gpRoom.me)) { GP.sent = k; gpSubmit(true); }
    }
  } else if (el) el.textContent = '♾️';
  gpAuto();
}
async function gpSubmit(auto) {
  const d = gpRoom.data; if (!d || d.phase !== 'play') return;
  const me = gpRoom.me, order = d.order || [], N = order.length, s = d.step, idx = order.indexOf(me); if (idx < 0) return;
  const type = gpType(s), book = gpBook(idx, s, N);
  let v;
  if (type === 'draw') { if (!D.c) return; v = D.c.toDataURL('image/jpeg', 0.72); }
  else {
    v = ($('gp-text')?.value || '').trim().slice(0, 100);
    if (!v) { if (!auto) return toast('Escreva algo primeiro!', 'err'); v = type === 'write' ? GP.sugg : '???'; }
  }
  try {
    await gpBooksRef(d.game).child(`${book}/${s}`).set({ by: me, v, ty: type === 'draw' ? 'd' : 't' });
    await gpRoom.ref.child(`sub/${s}/${me}`).set(true);
  } catch (e) { console.error(e); toast('Erro ao enviar, tente de novo', 'err'); }
}
function gpDone() {
  const d = gpRoom.data; if (!d || d.phase !== 'play') return;
  if (gpLocked()) {
    if (d.stepEnds && now() >= d.stepEnds) return toast('O tempo acabou!');
    gpRoom.ref.child(`sub/${d.step}/${gpRoom.me}`).remove();
  } else gpSubmit(false);
}
async function gpAutoFn() {
  const d = gpRoom.data; if (!d || !gpRoom.isHost || d.phase !== 'play') return;
  const k = d.game + '-' + d.step; if (GP.adv === k) return;
  const on = gpRoom.onlineNames(), order = d.order || [], need = order.filter(n => on.includes(n)), sub = d.sub?.[d.step] || {};
  const all = need.every(n => sub[n]), late = d.stepEnds && now() > d.stepEnds + 3500;
  if (!all && !late) return;
  GP.adv = k;
  const N = order.length, next = d.step + 1;
  if (next < N) {
    const sp = GP_SPEEDS[d.speed] || GP_SPEEDS.normal, dur = gpType(next) === 'draw' ? sp.d : sp.w;
    await gpRoom.update({ step: next, stepEnds: dur ? now() + dur * 1000 + 800 : 0 });
  } else await gpRoom.update({ phase: 'reveal', reveal: { book: 0, idx: 0 }, stepEnds: 0 });
}

// ── Editor de desenho ────────────────────────────────────────────────
const D = { tool: 'pen', color: '#000000', size: 5, alpha: 1, undo: [], redo: [], c: null, x: null, o: null, ox: null, down: false, pts: [], sx: 0, sy: 0, W: 800, H: 500 };
function gpEditorHtml() {
  return `<div class="gp-editor">
  <div class="gp-tools">${GP_TOOLS.map(([k, ic, t]) => `<button class="gp-tool" data-tool="${k}" title="${t}" onclick="dSet('tool','${k}')">${ic}</button>`).join('')}
    <div class="gp-sep"></div>
    <button class="gp-tool" title="Desfazer (Ctrl+Z)" onclick="dUndo()">↩️</button>
    <button class="gp-tool" title="Refazer (Ctrl+Y)" onclick="dRedo()">↪️</button>
    <button class="gp-tool" title="Limpar tudo" onclick="dClear()">🗑️</button></div>
  <div class="gp-canvas-wrap" id="gp-cw"><canvas id="gpc" width="800" height="500"></canvas><canvas id="gpo" width="800" height="500"></canvas></div>
  <div class="gp-colors">${GP_COLORS.map(c => `<button class="gp-color" data-color="${c}" title="${c}" style="background:${c}" onclick="dSet('color','${c}')"></button>`).join('')}
    <label class="gp-color custom" title="Cor personalizada"><input type="color" id="gp-cc" onchange="dSet('color',this.value)">🎨</label></div>
  <div class="gp-bar">
    <div class="gp-cur" id="gp-cur"></div>
    <div class="gp-group">${GP_SIZES.map(s => `<button class="gp-size" data-size="${s}" title="Espessura ${s}" onclick="dSet('size',${s})"><i style="width:${Math.max(3, Math.min(s, 24))}px;height:${Math.max(3, Math.min(s, 24))}px"></i></button>`).join('')}</div>
    <div class="gp-group">${[1, .75, .5, .25].map(a => `<button class="gp-alpha" data-alpha="${a}" title="Opacidade" onclick="dSet('alpha',${a})">${a * 100}%</button>`).join('')}</div>
    ${gpDoneBtn()}
  </div></div>`;
}
function dInit() {
  D.c = $('gpc'); D.x = D.c.getContext('2d', { willReadFrequently: true }); D.o = $('gpo'); D.ox = D.o.getContext('2d');
  D.x.fillStyle = '#fff'; D.x.fillRect(0, 0, D.W, D.H); D.undo = []; D.redo = [];
  D.o.addEventListener('pointerdown', dDown); D.o.addEventListener('pointermove', dMove);
  D.o.addEventListener('pointerup', dUp); D.o.addEventListener('pointercancel', dUp);
  dSync();
}
function dSet(k, v) { D[k] = v; if (k === 'color' && D.tool === 'eraser') D.tool = 'pen'; dSync(); }
function dSync() {
  document.querySelectorAll('.gp-tool[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === D.tool));
  document.querySelectorAll('.gp-color[data-color]').forEach(b => b.classList.toggle('active', b.dataset.color === D.color));
  document.querySelectorAll('.gp-size').forEach(b => b.classList.toggle('active', +b.dataset.size === D.size));
  document.querySelectorAll('.gp-alpha').forEach(b => b.classList.toggle('active', +b.dataset.alpha === D.alpha));
  const cc = $('gp-cc'); if (cc) cc.value = D.color;
  const cur = $('gp-cur'); if (cur) { cur.style.background = D.tool === 'eraser' ? '#fff' : D.color; cur.style.opacity = D.alpha; }
  const cw = $('gp-cw'); if (cw) cw.style.cursor = D.tool === 'fill' ? 'cell' : 'crosshair';
}
function dPos(e) { const r = D.o.getBoundingClientRect(); return [(e.clientX - r.left) * D.W / r.width, (e.clientY - r.top) * D.H / r.height]; }
function dSnap() { D.undo.push(D.x.getImageData(0, 0, D.W, D.H)); if (D.undo.length > 25) D.undo.shift(); D.redo = []; }
function dDown(e) {
  if (gpLocked() || (e.pointerType === 'mouse' && e.button !== 0)) return;
  e.preventDefault(); try { D.o.setPointerCapture(e.pointerId); } catch (_) { }
  const [x, y] = dPos(e); dSnap();
  if (D.tool === 'fill') { dFill(Math.floor(x), Math.floor(y)); return; }
  D.down = true; D.sx = x; D.sy = y; D.pts = [[x, y]];
  D.o.style.opacity = D.tool === 'eraser' ? 1 : D.alpha;
  dPreview(x, y);
}
function dMove(e) {
  if (!D.down) return;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  let x, y;
  for (const ev of (evs.length ? evs : [e])) { [x, y] = dPos(ev); if (D.tool === 'pen' || D.tool === 'eraser') D.pts.push([x, y]); }
  dPreview(x, y);
}
function dUp() {
  if (!D.down) return; D.down = false;
  D.x.save(); D.x.globalAlpha = D.tool === 'eraser' ? 1 : D.alpha; D.x.drawImage(D.o, 0, 0); D.x.restore();
  D.ox.clearRect(0, 0, D.W, D.H); D.o.style.opacity = 1;
}
function dPreview(x, y) {
  const c = D.ox, t = D.tool; c.clearRect(0, 0, D.W, D.H);
  c.strokeStyle = c.fillStyle = t === 'eraser' ? '#ffffff' : D.color;
  c.lineWidth = t === 'eraser' ? D.size * 2 : D.size; c.lineCap = 'round'; c.lineJoin = 'round';
  if (t === 'pen' || t === 'eraser') {
    const p = D.pts;
    if (p.length === 1) { c.beginPath(); c.arc(p[0][0], p[0][1], c.lineWidth / 2, 0, Math.PI * 2); c.fill(); return; }
    c.beginPath(); c.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length - 1; i++) { const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2; c.quadraticCurveTo(p[i][0], p[i][1], mx, my); }
    const l = p[p.length - 1]; c.lineTo(l[0], l[1]); c.stroke(); return;
  }
  const sx = D.sx, sy = D.sy; c.beginPath();
  if (t === 'line') { c.moveTo(sx, sy); c.lineTo(x, y); c.stroke(); }
  else if (t === 'rect' || t === 'rectf') { c.rect(Math.min(sx, x), Math.min(sy, y), Math.abs(x - sx), Math.abs(y - sy)); t === 'rectf' ? c.fill() : c.stroke(); }
  else { c.ellipse((sx + x) / 2, (sy + y) / 2, Math.abs(x - sx) / 2 || .5, Math.abs(y - sy) / 2 || .5, 0, 0, Math.PI * 2); t === 'ellipsef' ? c.fill() : c.stroke(); }
}
function dFill(x, y) {
  const W = D.W, H = D.H; if (x < 0 || y < 0 || x >= W || y >= H) return;
  const img = D.x.getImageData(0, 0, W, H), a = img.data, i0 = (y * W + x) * 4;
  const tr = a[i0], tg = a[i0 + 1], tb = a[i0 + 2];
  const h = D.color.replace('#', ''), fr = parseInt(h.slice(0, 2), 16), fg = parseInt(h.slice(2, 4), 16), fb = parseInt(h.slice(4, 6), 16), al = D.alpha;
  const nr = Math.round(tr * (1 - al) + fr * al), ng = Math.round(tg * (1 - al) + fg * al), nb = Math.round(tb * (1 - al) + fb * al);
  if (Math.abs(nr - tr) + Math.abs(ng - tg) + Math.abs(nb - tb) < 3) { D.undo.pop(); return; }
  const seen = new Uint8Array(W * H), stack = [y * W + x], TOL = 90;
  while (stack.length) {
    const p = stack.pop(); if (seen[p]) continue; seen[p] = 1;
    const i = p * 4; if (Math.abs(a[i] - tr) + Math.abs(a[i + 1] - tg) + Math.abs(a[i + 2] - tb) > TOL) continue;
    a[i] = nr; a[i + 1] = ng; a[i + 2] = nb; a[i + 3] = 255;
    const px = p % W;
    if (px > 0) stack.push(p - 1); if (px < W - 1) stack.push(p + 1);
    if (p >= W) stack.push(p - W); if (p < W * H - W) stack.push(p + W);
  }
  D.x.putImageData(img, 0, 0);
}
function dUndo() { if (!D.c || gpLocked() || !D.undo.length) return; D.redo.push(D.x.getImageData(0, 0, D.W, D.H)); D.x.putImageData(D.undo.pop(), 0, 0); }
function dRedo() { if (!D.c || gpLocked() || !D.redo.length) return; D.undo.push(D.x.getImageData(0, 0, D.W, D.H)); D.x.putImageData(D.redo.pop(), 0, 0); }
function dClear() { if (!D.c || gpLocked()) return; dSnap(); D.x.fillStyle = '#fff'; D.x.fillRect(0, 0, D.W, D.H); }
document.addEventListener('keydown', e => {
  if (!D.c || !document.body.contains(D.c)) return;
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? dRedo() : dUndo(); }
  else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); dRedo(); }
  else if (!e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT') {
    const m = { p: 'pen', e: 'eraser', b: 'fill', l: 'line' }[k]; if (m) dSet('tool', m);
  }
});

// ── Apresentação ─────────────────────────────────────────────────────
function gpAlbums(d) {
  if (GP.albGame === d.game && GP.albRef) return;
  gpDetachAlb(); GP.albGame = d.game;
  GP.albRef = gpBooksRef(d.game);
  GP.albH = GP.albRef.on('value', s => {
    GP.albums = s.val() || {};
    const dd = gpRoom.data; if (G.page !== 'gp-room' || !dd) return;
    if (dd.phase === 'reveal') { GP.rvSig = ''; gpFillReveal(); } else if (dd.phase === 'end') { GP.endSig = ''; render(); }
  });
}
function gpEntryHtml(e, holder, s, isNew) {
  const by = e?.by || holder, isD = s % 2 === 1;
  let c;
  if (!e || !e.v) c = '<div class="gp-bubble empty">(nada enviado)</div>';
  else if (e.ty === 'd' && /^data:image\//.test(e.v)) c = `<img class="gp-img" src="${esc(e.v)}" alt="desenho de ${esc(by)}">`;
  else c = `<div class="gp-bubble">${esc(e.v)}</div>`;
  return `<div class="gp-entry ${isD ? 'draw' : 'text'} ${isNew ? 'new' : ''}"><div class="gp-entry-by">${avatar(by, 26)}<b>${esc(by)}</b><span class="muted small">${s === 0 ? 'escreveu' : isD ? 'desenhou' : 'descreveu'}</span></div>${c}</div>`;
}
function rGpReveal(d) {
  gpAlbums(d);
  if (gpSetKey('reveal-' + d.game)) {
    paint(`<div class="page gp-page"><div class="gp-wrap">
      <div class="gp-top"><button class="back" onclick="gpLeave()">← Sair</button><div class="gp-step">📖 Apresentação</div><div></div></div>
      <div id="gp-rv"></div><div id="gp-rv-ctrl" class="gp-rv-ctrl"></div></div></div>`);
  }
  gpFillReveal();
}
function gpFillReveal() {
  const d = gpRoom.data; if (!d || d.phase !== 'reveal') return;
  const el = $('gp-rv'), ctrl = $('gp-rv-ctrl'); if (!el) return;
  const order = d.order || [], N = order.length, r = d.reveal || { book: 0, idx: 0 }, al = (GP.albums || {})[r.book] || {};
  const sig = `${r.book}-${r.idx}-${GP.albums ? 1 : 0}`;
  if (GP.rvSig !== sig) {
    GP.rvSig = sig;
    el.innerHTML = `<div class="gp-album-head">${avatar(order[r.book], 44)}<div><div class="eyebrow">Álbum ${r.book + 1} de ${N}</div><div class="h2">Álbum de ${esc(order[r.book])}</div></div></div>
      <div class="gp-album">${GP.albums ? Array.from({ length: r.idx + 1 }, (_, s) => gpEntryHtml(al[s], gpHolder(order, r.book, s), s, s === r.idx)).join('') : '<div class="spinner"></div>'}</div>`;
    const last = el.querySelector('.gp-entry:last-child');
    if (last && r.idx > 0) setTimeout(() => last.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  }
  if (ctrl) {
    const lastStep = r.idx >= N - 1, lastBook = r.book >= N - 1;
    ctrl.innerHTML = gpRoom.isHost
      ? `<div class="row">${!lastStep ? `<button class="btn btn-secondary" onclick="gpRvNext(true)">⏩ Mostrar tudo</button>` : ''}
         <button class="btn btn-primary" onclick="gpRvNext(false)">${!lastStep ? '▶ Próximo' : !lastBook ? '📖 Próximo álbum' : '🏁 Finalizar'}</button></div>`
      : `<div class="status">🎤 ${esc(gpRoom.host())} está apresentando os álbuns<span class="dots"></span></div>`;
  }
}
async function gpRvNext(all) {
  const d = gpRoom.data, N = (d.order || []).length, r = d.reveal || { book: 0, idx: 0 };
  if (all) return gpRoom.update({ 'reveal/idx': N - 1 });
  if (r.idx < N - 1) return gpRoom.update({ 'reveal/idx': r.idx + 1 });
  if (r.book < N - 1) return gpRoom.update({ reveal: { book: r.book + 1, idx: 0 } });
  return gpRoom.update({ phase: 'end' });
}
function rGpEnd(d) {
  gpAlbums(d); gpSetKey('end-' + d.game);
  const order = d.order || [], N = order.length, b = Math.min(GP.view, N - 1), al = (GP.albums || {})[b] || {};
  const sig = [b, GP.albums ? 1 : 0, gpRoom.isHost, d.game, gpRoom.host()].join('|');
  if (GP.endSig === sig) return; GP.endSig = sig;
  paint(`<div class="page gp-page"><div class="gp-wrap">
    <div class="gp-top"><button class="back" onclick="gpLeave()">← Sair</button><div class="gp-step">🏁 Fim de jogo!</div><div></div></div>
    <div class="gp-tabs">${order.map((n, i) => `<button class="gp-tab ${i === b ? 'active' : ''}" onclick="GP.view=${i};render()">${avatar(n, 24)}<span>${esc(n)}</span></button>`).join('')}</div>
    <div class="gp-album-head">${avatar(order[b], 40)}<div class="h2">Álbum de ${esc(order[b])}</div></div>
    <div class="gp-album">${GP.albums ? Array.from({ length: N }, (_, s) => gpEntryHtml(al[s], gpHolder(order, b, s), s, false)).join('') : '<div class="spinner"></div>'}</div>
    <button class="btn btn-secondary" onclick="gpDownload(${b})">💾 Baixar este álbum como imagem</button>
    ${gpRoom.isHost ? `<button class="btn btn-primary" onclick="gpBackLobby()">🔄 Jogar de novo</button>` : '<div class="status">O host pode começar uma nova partida<span class="dots"></span></div>'}
  </div></div>`);
}
async function gpBackLobby() { GP.view = 0; await gpRoom.update({ phase: 'lobby', sub: null, reveal: null, order: null, step: 0, stepEnds: 0 }); }

// ── Baixar álbum como imagem ─────────────────────────────────────────
function gpLoadImg(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }
function gpWrap(x, text, max) {
  const words = String(text).split(' '), lines = []; let l = '';
  for (const w of words) { const t = l ? l + ' ' + w : w; if (x.measureText(t).width > max && l) { lines.push(l); l = w; } else l = t; }
  if (l) lines.push(l); return lines;
}
function gpRR(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
async function gpDownload(b) {
  const d = gpRoom.data, order = d.order || [], N = order.length, al = (GP.albums || {})[b] || {};
  toast('Gerando imagem...');
  const W = 840, P = 30, IW = W - 2 * P, IH = Math.round(IW * 5 / 8), F = 'system-ui, -apple-system, Segoe UI, sans-serif';
  const c = document.createElement('canvas'), x = c.getContext('2d');
  x.font = `600 24px ${F}`;
  const items = []; let H = P + 70;
  for (let s = 0; s < N; s++) {
    const e = al[s], it = { by: e?.by || gpHolder(order, b, s), s };
    if (e && e.ty === 'd' && e.v) { it.img = await gpLoadImg(e.v); it.h = IH; }
    else { it.lines = gpWrap(x, e?.v || '(nada enviado)', IW - 40); it.h = it.lines.length * 32 + 30; }
    H += 36 + it.h + 24; items.push(it);
  }
  c.width = W; c.height = H + P;
  x.fillStyle = '#14141c'; x.fillRect(0, 0, W, c.height);
  x.fillStyle = '#fff'; x.font = `800 30px ${F}`; x.fillText('🎨 Álbum de ' + order[b], P, P + 34);
  let y = P + 70;
  for (const it of items) {
    x.fillStyle = '#a8a8d0'; x.font = `600 20px ${F}`;
    x.fillText(it.by + (it.s === 0 ? ' escreveu:' : it.s % 2 ? ' desenhou:' : ' descreveu:'), P, y + 22); y += 36;
    if (it.img) { x.drawImage(it.img, P, y, IW, IH); }
    else if (it.lines) { x.fillStyle = '#2a2a3c'; gpRR(x, P, y, IW, it.h, 14); x.fill(); x.fillStyle = '#fff'; x.font = `600 24px ${F}`; it.lines.forEach((l, i) => x.fillText(l, P + 20, y + 38 + i * 32)); }
    else { x.fillStyle = '#2a2a3c'; x.fillRect(P, y, IW, it.h); }
    y += it.h + 24;
  }
  x.fillStyle = '#666'; x.font = `14px ${F}`; x.fillText('GameHub · Gartic Phone', P, c.height - 14);
  c.toBlob(bl => { const a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = `album-${order[b]}.png`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }, 'image/png');
}
