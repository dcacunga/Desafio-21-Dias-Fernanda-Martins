import { useState, useEffect } from 'react';
import {
  OFFER_CONFIG,
  formatMoney,
  calculateDiscount,
  buildCheckoutUrl,
  UserProfile,
} from '../quizLogic';
import { WeeksBreakdown } from './Charts';

interface OfferPageProps {
  profile: UserProfile;
}

const OFFER_TOTAL_SECONDS = 600; // 10 minutes

export function OfferPage({ profile }: OfferPageProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem('fernanda-offer-start');
      if (stored) {
        const start = Number(stored);
        const elapsed = Math.floor((Date.now() - start) / 1000);
        return Math.max(0, OFFER_TOTAL_SECONDS - elapsed);
      }
      sessionStorage.setItem('fernanda-offer-start', String(Date.now()));
    } catch {}
    return OFFER_TOTAL_SECONDS;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const { price, oldPrice, guaranteeDays } = OFFER_CONFIG;
  const discount = calculateDiscount(price, oldPrice);
  const checkoutHref = buildCheckoutUrl(OFFER_CONFIG.checkoutUrl);

  const scrollToDeal = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('pacote')?.scrollIntoView({ behavior: 'smooth' });
  };

  const packRows = [
    {
      icon: '▶',
      title: 'Plano de aulas em casa',
      desc: 'Uma sequência organizada para acompanhares ao longo do desafio.',
    },
    {
      icon: '◎',
      title: 'Demonstração dos movimentos',
      desc: 'Orientações visuais para acompanhares cada aula.',
    },
    {
      icon: '▦',
      title: 'Calendário de três semanas',
      desc: 'Um caminho claro para distribuir a prática na tua rotina.',
    },
    {
      icon: '🎁',
      title: 'Materiais complementares',
      desc: 'Guias de apoio para consultares durante o programa.',
    },
    {
      icon: '🤝',
      title: 'Acompanhamento por 30 dias',
      desc: 'Fernanda e equipa estarão contigo para tirar dúvidas e apoiar-te durante o desafio.',
    },
  ];

  const bonuses = [
    {
      img: '/media/ext-02.webp',
      title: 'Receitas saudáveis',
      value: '10.900 Kz',
    },
    {
      img: '/media/ext-00.webp',
      title: 'Guia Eliminando a Flacidez',
      value: '9.480 Kz',
    },
    {
      img: '/media/ext-03.webp',
      title: 'Guia Eliminando a Celulite',
      value: '9.260 Kz',
    },
    {
      img: '/media/ext-04.webp',
      title: 'Como Superar a Menopausa',
      value: '10.640 Kz',
    },
  ];

  const faqs = [
    {
      q: 'Preciso de experiência em Pilates?',
      a: 'Podes começar como iniciante. Acompanha as orientações de cada aula e ajusta o movimento ao teu nível de conforto.',
    },
    {
      q: 'Tenho de pagar todos os meses?',
      a: `Não. O valor apresentado é de ${formatMoney(price)} Kz, em pagamento único.`,
    },
    {
      q: 'Preciso de aparelhos?',
      a: 'A proposta é praticar em casa, com uma parede e espaço livre. Um tapete confortável pode ajudar nos movimentos realizados no chão.',
    },
    {
      q: 'Como recebo o acesso?',
      a: 'Após a confirmação do pagamento, receberás o acesso pelo WhatsApp e pelo email informados na compra.',
    },
    {
      q: 'E se eu não gostar?',
      a: `Tens uma garantia de ${guaranteeDays} dias. Se não ficares satisfeita, podes solicitar o reembolso dentro desse prazo.`,
    },
    {
      q: 'E se tiver dor, lesão ou alguma limitação?',
      a: 'Procura orientação de um profissional de saúde antes de iniciar. O questionário não avalia se um exercício é adequado ao teu caso. Interrompe qualquer movimento que provoque dor.',
    },
    {
      q: 'Vou perder uma quantidade específica de peso?',
      a: 'Não há uma quantidade de peso garantida. Os resultados dependem de vários factores e variam de pessoa para pessoa. O desafio organiza a tua prática durante 21 dias.',
    },
  ];

  return (
    <article className="offer won has-disc" id="offer-root" data-disc="1">
      <style>{`
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
        .xb-eye{text-align:center;color:#bd246d;font-size:12px;font-weight:800;letter-spacing:.14em;margin:0 0 8px}
        .xb-title{font-size:32px!important;font-weight:900;text-transform:uppercase;color:#18181b!important;margin:0 0 12px;line-height:1.05;text-align:center}
        .xb-title em{color:#ec4899;font-style:normal}
        .xb-lead{text-align:center;color:#555;font-size:14px;margin:0 auto 22px;max-width:380px}
      `}</style>

      {/* Top Black Friday Announcement Banner */}
      <div className="bf-top" role="status">
        🎁 OFERTA POR TEMPO LIMITADO · <span>BLACK FRIDAY</span> 🎁
      </div>

      <p className="eyebrow">Aulas sem sair de casa</p>
      <h1 className="title" tabIndex={-1}>
        {profile.name ? `${profile.name}, o` : 'O'} teu plano de treino de Pilates está pronto!
        <br />
        <em>Começa hoje e muda de vida em 2026!</em>
      </h1>

      <p className="offer-lead">
        Pilates na Parede com Fernanda Martins. Uma sequência de aulas em casa para trabalhares força,
        mobilidade e uma rotina de movimento no teu ritmo.
      </p>

      {/* Package features */}
      <section>
        <h2>O que vais receber</h2>
        <div className="plan-pack">
          <header>
            <b>21</b>
            <span>
              DIAS DE PILATES
              <br />
              NA PAREDE
            </span>
          </header>
          {packRows.map((row, i) => (
            <div key={i} className="pack-row">
              <span className="icon" aria-hidden="true">
                {row.icon}
              </span>
              <div>
                <strong>{row.title}</strong>
                <small>{row.desc}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 weeks progression */}
      <section>
        <h2>Como funciona o desafio</h2>
        <WeeksBreakdown />
      </section>

      {/* Comparison: Without routine vs With challenge */}
      <section>
        <h2>Sem uma rotina vs. com o desafio</h2>
        <div className="comparison">
          <div>
            <strong>SEM UMA ROTINA</strong>
            <p>✕ Não saber o que praticar.</p>
            <p>✕ Adiar por falta de organização.</p>
            <p>✕ Começar sem uma sequência.</p>
          </div>
          <div>
            <strong>COM O DESAFIO</strong>
            <p>✓ Uma aula para acompanhares.</p>
            <p>✓ Um momento reservado na agenda.</p>
            <p>✓ Um percurso de 21 dias.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-strip" aria-label="Depoimentos de alunas">
        <h2>O que as nossas alunas dizem</h2>
        <div className="testimonial-grid">
          <img
            src="/media/ext-07.webp"
            alt="Depoimento de Carla Martins"
            loading="lazy"
            decoding="async"
          />
          <img
            src="/media/ext-09.webp"
            alt="Depoimento de Fernanda Santos"
            loading="lazy"
            decoding="async"
          />
          <img
            src="/media/ext-08.webp"
            alt="Depoimento adicional de uma aluna"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      {/* 4 Exclusive Bonuses */}
      <section>
        <p className="xb-eye">🎁 E NÃO É SÓ ISSO</p>
        <h2 className="xb-title">
          Ainda tem <em>mais.</em>
        </h2>
        <p className="xb-lead">
          O Desafio 21 Dias inclui também 4 bónus exclusivos para acelerar os teus resultados e
          transformar a tua rotina em casa.
        </p>
        <div className="bonus-grid">
          {bonuses.map((b, idx) => (
            <article key={idx} className="bonus">
              <img src={b.img} alt={b.title} loading="lazy" decoding="async" />
              <div>
                <strong>{b.title}</strong>
                <small className="bonus-old">✕ DE {b.value}</small>
                <small className="bonus-free">✓ POR 0 Kz</small>
              </div>
            </article>
          ))}
        </div>
        <p className="disclaimer">
          Materiais educativos complementares. Não substituem aconselhamento médico ou nutricional
          individual.
        </p>
      </section>

      {/* Main Deal Card (#pacote) */}
      <div className="deal" id="pacote">
        <h2 className="deal-title">
          GARANTE O TEU PLANO PESSOAL
          <span className="only-won">
            <br />
            <em>AGORA {discount.pct}% OFF!</em>
          </span>
        </h2>

        <div className="offer-bar only-won js-bar">
          {secondsLeft > 0 ? (
            <>
              ⏱ Oferta válida por <b className="js-timer">{formatTimer(secondsLeft)}</b>
            </>
          ) : (
            '🔥 Garante o teu plano hoje'
          )}
        </div>

        <div className="plan-card">
          <div className="bf-badge">🎁 BLACK FRIDAY 🎁</div>
          <div className="plan-card-head only-won">
            🎁 PRENDA DE HOJE · {discount.pct}% DE DESCONTO
          </div>
          <div className="plan-card-body">
            <div className="plan-card-info">
              <strong>DESAFIO 21 DIAS</strong>
              <span className="plan-tag">Pagamento único</span>
              <p className="worth">
                Tudo o que vais receber vale mais de {formatMoney(oldPrice)} Kz
              </p>
              <div className="prices">
                <s className="old">{formatMoney(oldPrice)} Kz</s>
                <b className="new">{formatMoney(price)} Kz</b>
              </div>
              <p className="pay-once">Pagamento único — sem mensalidade</p>
            </div>
          </div>
        </div>

        <p className="guarantee-link">GARANTIA DE {guaranteeDays} DIAS</p>

        <div className="buy-wrap">
          <a
            className="buy"
            href={checkoutHref}
            target="_top"
            rel="noopener noreferrer"
          >
            GARANTIR O MEU PLANO DE AULAS
          </a>
        </div>

        <p className="fine">
          Pagamento único, sem mensalidades e sem cobranças recorrentes. Recebes o acesso ao plano
          de aulas após a confirmação do pagamento.
        </p>
      </div>

      {/* Check points */}
      <ul className="check-points">
        <li>Pagamento único de {formatMoney(price)} Kz, sem mensalidades.</li>
        <li>Acesso ao plano de aulas após a confirmação do pagamento.</li>
        <li>Sem renovação automática e sem cobranças futuras.</li>
        <li>
          Garantia de {guaranteeDays} dias: se não ficares satisfeita, podes pedir o reembolso.
        </li>
      </ul>

      {/* Guarantee Section */}
      <section className="guarantee">
        <img
          src="/media/ext-01.webp"
          alt="Selo de garantia de 30 dias"
          width={500}
          height={500}
          loading="lazy"
          decoding="async"
        />
        <h2>{guaranteeDays} dias de garantia</h2>
        <p>
          Tens {guaranteeDays} dias após a compra para conhecer o programa. Se não ficares
          satisfeita, podes solicitar a devolução do valor pago dentro do prazo da garantia.
        </p>
      </section>

      {/* FAQ Accordion */}
      <section className="faq">
        <h2>Perguntas frequentes</h2>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}

        <a className="buy" href="#pacote" onClick={scrollToDeal}>
          GARANTIR O MEU PLANO POR {formatMoney(price)} Kz
        </a>
      </section>
    </article>
  );
}
