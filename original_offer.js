'use strict';
/* Última página (oferta): substitui offer() e startReadingClock() do app.js.
   - sem a etapa "Tempo de leitura do teu plano"
   - estrutura de oferta com cronómetro de 10 min, raspadinha, confetes
   - preço anterior a vermelho (riscado) e preço novo a verde (cfg.oldPrice em config.js) */
const OFFER_SECONDS = 600;

/* O <script> deste embed não corre dentro de innerHTML. loadOfferVsl cria o mesmo player.js uma vez. */
const OFFER_VSL_SLOT = `<!-- VSL EMBED START -->
<vturb-smartplayer id="vid-6af2a379d48c8b14778a8013" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 177.77777777777777% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer> <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/23a3aa1c-3b25-404e-830b-04516ae06b00/players/6af2a379d48c8b14778a8013/v4/player.js", s.async=!0,document.head.appendChild(s); </script>
<!-- VSL EMBED END -->`;
const OFFER_VSL_SRC = 'https://scripts.converteai.net/23a3aa1c-3b25-404e-830b-04516ae06b00/players/6af2a379d48c8b14778a8013/v4/player.js';

function loadOfferVsl() {
  if (document.querySelector('script[data-offer-vsl]')) return;
  if (!document.getElementById('vid-6af2a379d48c8b14778a8013')) return;
  const s = document.createElement('script');
  s.src = OFFER_VSL_SRC;
  s.async = true;
  s.dataset.offerVsl = '6af2a379d48c8b14778a8013';
  document.head.appendChild(s);
}

function offerVsl() {
  const match = OFFER_VSL_SLOT.match(/<!-- VSL EMBED START -->([\s\S]*?)<!-- VSL EMBED END -->/);
  const inner = match ? match[1].trim() : '';
  const hasEmbed = Boolean(inner) && inner !== '[COLE_AQUI_O_EMBED_DA_VSL]';
  const media = hasEmbed
    ? `<div class="vsl-embed"><!-- VSL EMBED START -->${inner}<!-- VSL EMBED END --></div>`
    : `<div class="vsl-placeholder"><span class="vsl-play" aria-hidden="true"></span><strong>Vídeo explicativo</strong><small>O teu plano personalizado está pronto</small></div>`;
  return `<section class="step offer-vsl" data-step="offer-vsl"><style>
      .plan-ready{text-align:center;color:#18181b;font-size:14px;line-height:1.3;margin:0 10px 4px}
      .vsl-urgent{text-align:center;color:#bd246d;font-size:15px;font-weight:800;line-height:1.3;margin:0 12px 8px}
      .vsl-frame{width:min(90vw,400px);max-width:100%;margin:8px auto 0;border-radius:16px;overflow:hidden;box-shadow:0 8px 22px #00000024}
      .vsl-embed vturb-smartplayer{display:block;width:100%;max-width:400px;margin:0 auto}
      .offer-vsl .primary{margin-top:14px}
    </style><p class="plan-ready">Assiste ao vídeo abaixo para entenderes como funciona e qual é o próximo passo. 👇</p><p class="vsl-urgent">Assiste agora, antes que a promoção acabe.</p><div class="vsl-frame">${media}</div><button class="primary" type="button" data-action="next">Quero ver a minha oferta</button></section>`;
}

function stopOfferVsl() {
  const player = document.getElementById('vid-6af2a379d48c8b14778a8013');
  if (!player) return;
  const pause = (root) => {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('video, audio').forEach((el) => { try { el.pause(); } catch (e) {} });
  };
  try { if (typeof player.pause === 'function') player.pause(); } catch (e) {}
  pause(player);
  try { pause(player.shadowRoot); } catch (e) {}
}

function offerMoney(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

function offerDeal(d) {
  const buyLabel = 'GARANTIR O MEU PLANO DE AULAS';
  return `<div class="deal" id="pacote">
    <h2 class="deal-title">GARANTE O TEU PLANO PESSOAL${d.hasDisc ? `<span class="only-won"><br><em>AGORA ${d.pct}% OFF!</em></span>` : ''}</h2>
    <div class="offer-bar only-won js-bar">⏱ Oferta válida por <b class="js-timer">10:00</b></div>
    <div class="plan-card">
      <div class="bf-badge">🎁 BLACK FRIDAY 🎁</div>
      <div class="plan-card-head only-won">🎁 PRENDA DE HOJE · ${d.pct}% DE DESCONTO</div>
      <div class="plan-card-body">
        <div class="plan-card-info">
          <strong>DESAFIO 21 DIAS</strong>
          <span class="plan-tag">Pagamento único</span>
          <p class="worth">Tudo o que vais receber vale mais de ${offerMoney(d.old || 35000)} Kz</p>
          <div class="prices"><s class="old">${offerMoney(d.old || 35000)} Kz</s><b class="new">${offerMoney(d.price)} Kz</b></div>
          <p class="pay-once">Pagamento único — sem mensalidade</p>
        </div>
      </div>
    </div>
    <p class="guarantee-link">GARANTIA DE ${cfg.guaranteeDays} DIAS</p>
    <div class="buy-wrap"><a class="buy" href="${checkout()}">${buyLabel}</a></div>
    <p class="fine">Pagamento único, sem mensalidades e sem cobranças recorrentes. Recebes o acesso ao plano de aulas após a confirmação do pagamento.</p>
  </div>`;
}

function offer() {
  const p = profile();
  const price = Number(cfg.price);
  const old = Number(cfg.oldPrice) || 0;
  const hasDisc = old > price;
  const d = { price, old, hasDisc, pct: hasDisc ? Math.round((1 - price / old) * 100) : 0, perDay: price / 21 };
  const buy = t => `<a class="buy" href="${checkout()}">${t}</a>`;
  return `<article class="offer${hasDisc ? ' has-disc' : ''}" id="offer-root" data-disc="${hasDisc ? 1 : 0}">
    <style>
      body:has(.bf-top){padding-top:44px}
      .bf-top{position:absolute;top:0;left:0;right:0;z-index:30;background:#111;color:#fff;text-align:center;font-weight:800;font-size:14px;letter-spacing:.03em;padding:11px 10px;box-shadow:0 2px 10px #0004}
      .bf-top span{color:#f9c80e}
      .deal .plan-card{overflow:visible;margin-top:22px}
      .bf-badge{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);background:linear-gradient(90deg,#111,#2a2a2a);color:#f9c80e;font-weight:900;font-size:13px;letter-spacing:.06em;white-space:nowrap;padding:7px 18px;border-radius:30px;border:2px solid #17a34a;box-shadow:0 4px 12px #0003;z-index:2}
      .deal .plan-card-body{justify-content:center;text-align:center;padding:28px 16px 20px}
      .deal .plan-card-info{display:flex;flex-direction:column;align-items:center}
      .deal .prices{justify-content:center}
      .worth{color:#18181b;text-align:center;font-size:13px;font-weight:700;margin:8px 0 4px}
      .pay-once{color:#666;text-align:center;font-size:12px;margin:6px 0 0}
    </style>
    <div class="bf-top" role="status">🎁 OFERTA POR TEMPO LIMITADO · <span>BLACK FRIDAY</span> 🎁</div>
    <p class="eyebrow">Aulas sem sair de casa</p>
    <h1 class="title" tabindex="-1">${p.name ? esc(p.name) + ', o' : 'O'} teu plano de treino de Pilates está pronto!<br><em>Começa hoje e muda de vida em 2026!</em></h1>
    <p class="offer-lead">Pilates na Parede com Fernanda Martins. Uma sequência de aulas em casa para trabalhares força, mobilidade e uma rotina de movimento no teu ritmo.</p>
    <section><h2>O que vais receber</h2><div class="plan-pack"><header><b>21</b><span>DIAS DE PILATES<br>NA PAREDE</span></header>${[['▶', 'Plano de aulas em casa', 'Uma sequência organizada para acompanhares ao longo do desafio.'], ['◎', 'Demonstração dos movimentos', 'Orientações visuais para acompanhares cada aula.'], ['▦', 'Calendário de três semanas', 'Um caminho claro para distribuir a prática na tua rotina.'], ['🎁', 'Materiais complementares', 'Guias de apoio para consultares durante o programa.'], ['🤝', 'Acompanhamento por 30 dias', 'Fernanda e equipa estarão contigo para tirar dúvidas e apoiar-te durante o desafio.']].map(([icon, title, txt]) => `<div class="pack-row"><span class="icon" aria-hidden="true">${icon}</span><div><strong>${title}</strong><small>${txt}</small></div></div>`).join('')}</div></section>
    <section><h2>Como funciona o desafio</h2>${weeks()}</section>
    <section><h2>Sem uma rotina vs. com o desafio</h2><div class="comparison"><div><strong>SEM UMA ROTINA</strong><p>✕ Não saber o que praticar.</p><p>✕ Adiar por falta de organização.</p><p>✕ Começar sem uma sequência.</p></div><div><strong>COM O DESAFIO</strong><p>✓ Uma aula para acompanhares.</p><p>✓ Um momento reservado na agenda.</p><p>✓ Um percurso de 21 dias.</p></div></div></section>
    <section class="testimonial-strip" aria-label="Depoimentos de alunas"><h2>O que as nossas alunas dizem</h2><div class="testimonial-grid"><img src="/media/ext-07.webp" alt="Depoimento de Carla Martins" loading="lazy" decoding="async"><img src="/media/ext-09.webp" alt="Depoimento de Fernanda Santos" loading="lazy" decoding="async"><img src="/media/ext-08.webp" alt="Depoimento adicional de uma aluna" loading="lazy" decoding="async"></div></section>
    <section><style>.xb-eye{text-align:center;color:#bd246d;font-size:12px;font-weight:800;letter-spacing:.14em;margin:0 0 8px}.xb-title{font-size:32px!important;font-weight:900;text-transform:uppercase;color:#18181b!important;margin:0 0 12px;line-height:1.05}.xb-title em{color:#ec4899;font-style:normal}.xb-lead{text-align:center;color:#555;font-size:14px;margin:0 auto 22px;max-width:380px}</style><p class="xb-eye">🎁 E NÃO É SÓ ISSO</p><h2 class="xb-title">Ainda tem <em>mais.</em></h2><p class="xb-lead">O Desafio 21 Dias inclui também 4 bónus exclusivos para acelerar os teus resultados e transformar a tua rotina em casa.</p><div class="bonus-grid">${[['/media/ext-02.webp', 'Receitas saudáveis', '10.900 Kz'], ['/media/ext-00.webp', 'Guia Eliminando a Flacidez', '9.480 Kz'], ['/media/ext-03.webp', 'Guia Eliminando a Celulite', '9.260 Kz'], ['/media/ext-04.webp', 'Como Superar a Menopausa', '10.640 Kz']].map(([img, title, value]) => `<article class="bonus">${media(img, title)}<div><strong>${title}</strong><small class="bonus-old">✕ DE ${value}</small><small class="bonus-free">✓ POR 0 Kz</small></div></article>`).join('')}</div><p class="disclaimer">Materiais educativos complementares. Não substituem aconselhamento médico ou nutricional individual.</p></section>
    ${offerDeal(d)}
    <ul class="check-points"><li>Pagamento único de ${offerMoney(price)} Kz, sem mensalidades.</li><li>Acesso ao plano de aulas após a confirmação do pagamento.</li><li>Sem renovação automática e sem cobranças futuras.</li><li>Garantia de ${cfg.guaranteeDays} dias: se não ficares satisfeita, podes pedir o reembolso.</li></ul>
    <section class="guarantee"><img src="/media/ext-01.webp" alt="Selo de garantia de 30 dias" width="500" height="500" loading="lazy" decoding="async"><h2>${cfg.guaranteeDays} dias de garantia</h2><p>Tens ${cfg.guaranteeDays} dias após a compra para conhecer o programa. Se não ficares satisfeita, podes solicitar a devolução do valor pago dentro do prazo da garantia.</p></section>
    <section class="faq"><h2>Perguntas frequentes</h2>${[['Preciso de experiência em Pilates?', 'Podes começar como iniciante. Acompanha as orientações de cada aula e ajusta o movimento ao teu nível de conforto.'], ['Tenho de pagar todos os meses?', `Não. O valor apresentado é de ${offerMoney(price)} Kz, em pagamento único.`], ['Preciso de aparelhos?', 'A proposta é praticar em casa, com uma parede e espaço livre. Um tapete confortável pode ajudar nos movimentos realizados no chão.'], ['Como recebo o acesso?', 'Após a confirmação do pagamento, receberás o acesso pelo WhatsApp e pelo email informados na compra.'], ['E se eu não gostar?', 'Tens uma garantia de 30 dias. Se não ficares satisfeita, podes solicitar o reembolso dentro desse prazo.'], ['E se tiver dor, lesão ou alguma limitação?', 'Procura orientação de um profissional de saúde antes de iniciar. O questionário não avalia se um exercício é adequado ao teu caso. Interrompe qualquer movimento que provoque dor.'], ['Vou perder uma quantidade específica de peso?', 'Não há uma quantidade de peso garantida. Os resultados dependem de vários factores e variam de pessoa para pessoa. O desafio organiza a tua prática durante 21 dias.']].map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}<a class="buy" href="#pacote" onclick="event.preventDefault();document.getElementById('pacote').scrollIntoView({behavior:'smooth'})">GARANTIR O MEU PLANO POR ${offerMoney(price)} Kz</a></section>
  </article>`;
}

/* ---------- comportamento: raspadinha, confetes e cronómetro ---------- */
function offerTick(start) {
  const left = Math.max(0, OFFER_SECONDS - Math.floor((Date.now() - start) / 1000));
  const txt = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0');
  document.querySelectorAll('.js-timer').forEach(el => { el.textContent = txt; });
  if (left === 0) {
    clearInterval(offerTimer);
    document.querySelectorAll('.js-bar').forEach(el => { el.innerHTML = '�� Garante o teu plano hoje'; });
    document.querySelectorAll('.sticky-offer small').forEach(el => { el.textContent = 'Oferta de hoje'; });
  }
}

/* Inicia a oferta e o cronómetro assim que a última etapa é apresentada. */
function startReadingClock() {
  const start = Number(sessionStorage.getItem('fernanda-offer-start')) || Date.now();
  sessionStorage.setItem('fernanda-offer-start', String(start));
  offerTick(start);
  clearInterval(offerTimer);
  offerTimer = setInterval(() => offerTick(start), 1000);
}
