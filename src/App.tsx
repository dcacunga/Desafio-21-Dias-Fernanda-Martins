import { useState, useEffect, useMemo, useRef } from 'react';
import {
  QUESTIONS,
  OFFER_CONFIG,
  QuizAnswers,
  calculateProfile,
  getNextStepIndex,
  getPrevStepIndex,
} from './quizLogic';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { VslPlayer } from './components/VslPlayer';
import { PhotoCarousel } from './components/PhotoCarousel';
import { HeightRuler } from './components/HeightRuler';
import { ActivityChart, PlanProgressChart, WeeksBreakdown } from './components/Charts';
import { OfferPage } from './components/OfferPage';

const STORAGE_KEY = 'fernanda-21-quiz-v7';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      if (stepParam) {
        const found = QUESTIONS.findIndex((q) => q.id === stepParam);
        if (found !== -1) return found;
      }
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Number.isInteger(parsed.index) && parsed.index >= 0 && parsed.index < QUESTIONS.length) {
          return parsed.index;
        }
      }
    } catch {}
    return 0;
  });

  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers && typeof parsed.answers === 'object') {
          return parsed.answers;
        }
      }
    } catch {}
    return {};
  });

  const [nameInput, setNameInput] = useState<string>(() => answers.name || '');
  const [nameError, setNameError] = useState<string>('');
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingPhase, setProcessingPhase] = useState<string>('A reunir as tuas respostas…');

  const currentStep = QUESTIONS[currentIndex] || QUESTIONS[0];

  // Sync to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ index: currentIndex, answers })
      );
    } catch {}
  }, [currentIndex, answers]);

  // Sync body class for hero step styling
  useEffect(() => {
    document.body.classList.toggle('quiz-first-step', currentStep.id === 'urgent-intro');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentStep.id]);

  const profile = useMemo(() => calculateProfile(answers), [answers]);
  const progressPct = Math.round((currentIndex / (QUESTIONS.length - 1)) * 100);

  const handleNext = () => {
    const nextIdx = getNextStepIndex(currentIndex, QUESTIONS, answers);
    setCurrentIndex(nextIdx);
  };

  const handleBack = () => {
    const prevIdx = getPrevStepIndex(currentIndex, QUESTIONS, answers);
    setCurrentIndex(prevIdx);
  };

  const handleRestart = () => {
    if (window.confirm('Queres apagar as respostas desta sessão e recomeçar?')) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem('fernanda-offer-start');
      } catch {}
      setAnswers({});
      setNameInput('');
      setCurrentIndex(0);
    }
  };

  const handleSingleSelect = (stepId: string, label: string) => {
    const updated = { ...answers, [stepId]: label };
    setAnswers(updated);
    const nextIdx = getNextStepIndex(currentIndex, QUESTIONS, updated);
    setCurrentIndex(nextIdx);
  };

  const handleMultiToggle = (stepId: string, label: string, exclusive?: string[]) => {
    let currentValues = Array.isArray(answers[stepId]) ? [...answers[stepId]] : [];
    if (exclusive?.includes(label)) {
      currentValues = currentValues.includes(label) ? [] : [label];
    } else {
      currentValues = currentValues.filter((x) => !exclusive?.includes(x));
      if (currentValues.includes(label)) {
        currentValues = currentValues.filter((x) => x !== label);
      } else {
        currentValues.push(label);
      }
    }
    setAnswers((prev) => ({ ...prev, [stepId]: currentValues }));
  };

  // Processing step timer
  useEffect(() => {
    if (currentStep.type !== 'processing') return;

    const started = Date.now();
    const duration = 12000;
    const phases = [
      'A analisar o teu objectivo…',
      'A organizar o tempo disponível…',
      'A distribuir as aulas por três semanas…',
      'O teu plano está quase pronto…',
    ];

    const timer = setInterval(() => {
      const elapsed = Date.now() - started;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProcessingProgress(pct);
      setProcessingPhase(phases[Math.min(3, Math.floor(pct / 25))]);

      if (pct >= 100) {
        clearInterval(timer);
        handleNext();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, currentStep.type]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (currentStep.type === 'name') {
      nameInputRef.current?.focus();
    }
  }, [currentStep.type]);

  return (
    <div className="app-container">
      <Header
        progressPct={progressPct}
        showBack={currentIndex > 0}
        onBack={handleBack}
      />

      <main aria-live="polite" className="main" id="main">
        {/* Progress Bar (hidden on offer page) */}
        {currentStep.type !== 'offer' && (
          <div className="progress">
            <div className="progress-label">
              <span>O teu progresso na avaliação…</span>
              <b>{progressPct}%</b>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Progresso do questionário"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* STEP: Hero Intro */}
        {currentStep.type === 'hero' && (
          <section className="step hero-intro" data-step="urgent-intro">
            <h1 className="title hero-urgent-title" tabIndex={-1}>
              <span className="hero-red">Seca a tua barriga em 21 dias</span>{' '}
              <span className="hero-black">com 10 minutos na parede.</span>
            </h1>

            <div className="hero-vsl">
              <VslPlayer
                id={OFFER_CONFIG.vslHeroId}
                scriptSrc={OFFER_CONFIG.vslHeroScript}
              />
            </div>

            <button
              type="button"
              className="primary hero-urgent-button"
              data-action="next"
              onClick={handleNext}
            >
              {currentStep.btnText || '🟢 COMEÇAR A MINHA AVALIAÇÃO GRATUITA'}
            </button>

            <p className="hero-security">
              🔒 Avaliação 100% gratuita · Sem necessidade de equipamentos
            </p>
          </section>
        )}

        {/* STEP: Single Choice */}
        {currentStep.type === 'single' && (
          <section className="step" data-step={currentStep.id}>
            <h1 className="title" tabIndex={-1}>
              {currentStep.title}
            </h1>
            {currentStep.sub && <p className="subtitle">{currentStep.sub}</p>}

            <div className={`options ${currentStep.cards ? 'cards' : ''}`}>
              {currentStep.options?.map((opt, i) => {
                const isSelected = answers[currentStep.id] === opt.label;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`option ${opt.image ? 'image-option' : ''}`}
                    data-choice={i}
                    aria-pressed={isSelected}
                    onClick={() => handleSingleSelect(currentStep.id, opt.label)}
                  >
                    {opt.image ? (
                      <>
                        <img
                          src={`/media/${opt.image}.webp`}
                          alt={opt.label}
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="card-label">
                          <span className="check" aria-hidden="true">
                            ✓
                          </span>
                          <span>{opt.label}</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="emoji" aria-hidden="true">
                          {opt.emoji || ''}
                        </span>
                        <span className="check" aria-hidden="true">
                          ✓
                        </span>
                        <span className="label">{opt.label}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP: Multi Choice */}
        {currentStep.type === 'multi' && (
          <section className="step" data-step={currentStep.id}>
            <h1 className="title" tabIndex={-1}>
              {currentStep.title}
            </h1>
            {currentStep.sub && <p className="subtitle">{currentStep.sub}</p>}

            <div className={`options ${currentStep.cards ? 'cards' : ''}`}>
              {currentStep.options?.map((opt, i) => {
                const selectedList = Array.isArray(answers[currentStep.id])
                  ? answers[currentStep.id]
                  : [];
                const isSelected = selectedList.includes(opt.label);
                return (
                  <button
                    key={i}
                    type="button"
                    className={`option multi ${opt.image ? 'image-option' : ''}`}
                    data-choice={i}
                    aria-pressed={isSelected}
                    onClick={() =>
                      handleMultiToggle(currentStep.id, opt.label, currentStep.exclusive)
                    }
                  >
                    {opt.image ? (
                      <>
                        <img
                          src={`/media/${opt.image}.webp`}
                          alt={opt.label}
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="card-label">
                          <span className="check" aria-hidden="true">
                            ✓
                          </span>
                          <span>{opt.label}</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="emoji" aria-hidden="true">
                          {opt.emoji || ''}
                        </span>
                        <span className="check" aria-hidden="true">
                          ✓
                        </span>
                        <span className="label">{opt.label}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="primary"
              data-action="next"
              style={{ marginTop: '20px' }}
              onClick={handleNext}
            >
              Continuar
            </button>
          </section>
        )}

        {/* STEP: Name input */}
        {currentStep.type === 'name' && (
          <section className="step" data-step="name">
            <h1 className="title" tabIndex={-1}>
              {currentStep.title}
            </h1>
            {currentStep.sub && <p className="subtitle">{currentStep.sub}</p>}

            <form
              id="answer-form"
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = nameInput.trim();
                if (!trimmed) {
                  setNameError('Escreve o teu primeiro nome para continuar.');
                  return;
                }
                setNameError('');
                setAnswers((prev) => ({ ...prev, name: trimmed }));
                handleNext();
              }}
            >
              <label className="helper" htmlFor="first-name">
                O teu primeiro nome
              </label>
              <input
                ref={nameInputRef}
                id="first-name"
                className="field"
                name="value"
                autoComplete="given-name"
                maxLength={40}
                required
                placeholder="Escreve o teu nome"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (nameError) setNameError('');
                }}
              />
              {nameError && (
                <p className="error" id="form-error" role="alert">
                  {nameError}
                </p>
              )}
              <button className="primary" type="submit">
                Continuar
              </button>
            </form>
          </section>
        )}

        {/* STEP: Intro (Fernanda Martins presentation) */}
        {currentStep.type === 'intro' && (
          <section className="step intro-screen" data-step="intro">
            <h1 className="title intro-title" tabIndex={-1}>
              Chamo-me Professora <strong>Fernanda Martins</strong>!
            </h1>
            <p className="intro-headline">
              Mais de <span className="highlight-pink">+750 mulheres</span> já realizaram o meu
              desafio de Pilates Na Parede de <strong>21 dias</strong>!
            </p>

            <PhotoCarousel kind="presentation" />

            <p className="intro-footer-copy">
              Responde a algumas perguntas a seguir para montar o{' '}
              <span className="highlight-pink">teu plano de aulas personalizado!</span>
            </p>

            <button
              type="button"
              className="primary"
              data-action="next"
              onClick={handleNext}
            >
              INICIAR AVALIAÇÃO
            </button>
          </section>
        )}

        {/* STEP: Break screens (social proof / encouragement) */}
        {currentStep.type === 'break' && (
          <section className="step break-screen" data-step={currentStep.id}>
            <div className="break-icon-wrap" aria-hidden="true">
              {currentStep.icon || '🤝'}
            </div>
            <h1 className="title break-title" tabIndex={-1}>
              {currentStep.title}
            </h1>
            <div className="break-card">
              {currentStep.stat && (
                <div className="break-stat-number">{currentStep.stat}</div>
              )}
              {currentStep.statSub && (
                <div className="break-stat-sub">{currentStep.statSub}</div>
              )}
              <p className="break-stat-desc">{currentStep.sub}</p>
            </div>
            <button
              type="button"
              className="primary break-btn"
              data-action="next"
              onClick={handleNext}
            >
              {currentStep.btnText || 'Entendi, quero continuar'}
            </button>
          </section>
        )}

        {/* STEP: TV Zimbo News */}
        {currentStep.type === 'news' && (
          <section className="step news-screen" data-step={currentStep.id}>
            <h1 className="title news-screen-title" tabIndex={-1}>
              <strong>INTERNAUTAS AFIRMAM</strong>
            </h1>
            <div className="news-frame">
              <div className="news-top-tarja">
                <img
                  src="/media/xaa-tarja.webp"
                  alt="Portal de Notícias"
                  className="tarja-banner"
                />
              </div>
              <div className="news-image-container">
                <img
                  src="/media/noticia-xaa.webp"
                  alt="Febre em Luanda: exercícios de 10 minutos na parede de casa viram a alternativa natural a ginásios e remédios caros"
                  className="news-single-img"
                  loading="eager"
                />
              </div>
            </div>
            <button
              type="button"
              className="primary break-btn"
              data-action="next"
              onClick={handleNext}
            >
              {currentStep.btnText || 'Continuar'}
            </button>
          </section>
        )}

        {/* STEP: Measure (Height Ruler) */}
        {currentStep.type === 'measure' && (
          <section className="step" data-step="height">
            <h1 className="title" tabIndex={-1}>
              {currentStep.title}
            </h1>
            {currentStep.sub && <p className="subtitle">{currentStep.sub}</p>}

            <HeightRuler
              initialValue={answers.height || currentStep.value || 165}
              unit={currentStep.unit || 'cm'}
              altUnit={currentStep.altUnit || 'pol'}
              min={currentStep.min || 100}
              max={currentStep.max || 230}
              onChange={(val) => setAnswers((prev) => ({ ...prev, height: val }))}
              onSubmit={(val) => {
                setAnswers((prev) => ({ ...prev, height: val }));
                handleNext();
              }}
            />
          </section>
        )}

        {/* STEP: Processing animation */}
        {currentStep.type === 'processing' && (
          <section className="step" data-step="processing">
            <h1 className="title" tabIndex={-1}>
              Estamos a criar o teu plano de aulas personalizado!
            </h1>
            <div className="analysis-progress">
              <div>
                <span id="analysis-status">{processingPhase}</span>
                <b id="analysis-number">{processingProgress}%</b>
              </div>
              <div
                className="analysis-track"
                role="progressbar"
                aria-label="Preparação do plano"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={processingProgress}
              >
                <i id="analysis-fill" style={{ width: `${processingProgress}%` }} />
              </div>
            </div>
            <p className="subtitle" style={{ marginTop: '16px' }}>
              A organizar o teu objectivo, a tua experiência e os teus horários num percurso de 21
              dias.
            </p>
            <PhotoCarousel kind="analysis" />
          </section>
        )}

        {/* STEP: Summary screen */}
        {currentStep.type === 'summary' && (
          <section className="step" data-step="summary">
            <h1 className="title" tabIndex={-1}>
              Este é o teu ponto de partida
            </h1>
            <p className="subtitle">
              {profile.name ? `${profile.name}, ` : ''}este resumo usa as respostas que acabaste de
              dar.
            </p>

            <div className="summary-card">
              <header>O teu perfil de prática</header>
              <dl>
                <div>
                  <dt>Objectivo</dt>
                  <dd>{profile.goal}</dd>
                </div>
                <div>
                  <dt>Experiência</dt>
                  <dd>{answers.experience || 'Não indicada'}</dd>
                </div>
                <div>
                  <dt>Tempo reservado</dt>
                  <dd>{profile.minutes} minutos</dd>
                </div>
                <div>
                  <dt>Frequência</dt>
                  <dd>{answers.days || '1 a 2 dias'}</dd>
                </div>
              </dl>
            </div>

            <p className="helper">Experiência que indicaste</p>
            <div className="level-bar">
              <span className={profile.level >= 1 ? 'active' : ''} />
              <span className={profile.level >= 2 ? 'active' : ''} />
              <span className={profile.level >= 3 ? 'active' : ''} />
            </div>
            <div className="level-labels">
              <span>Primeiro contacto</span>
              <span>Alguma prática</span>
              <span>Prática regular</span>
            </div>

            {profile.caution && (
              <div className="notice">
                Indicaste uma zona que precisa de atenção. Procura orientação profissional sobre os
                movimentos adequados antes de começares.
              </div>
            )}

            <ActivityChart activity={answers.activity} />

            <button
              type="button"
              className="primary"
              data-action="next"
              onClick={handleNext}
            >
              VER O MEU PERCURSO DE 21 DIAS
            </button>
          </section>
        )}

        {/* STEP: Plan preview */}
        {currentStep.type === 'plan' && (
          <section className="step" data-step="plan">
            <h1 className="title" tabIndex={-1}>
              O teu plano de treino de Pilates está pronto!
            </h1>
            <p className="subtitle">
              Três semanas para organizares uma prática que cabe na tua vida.
            </p>

            <PlanProgressChart days={profile.days} />
            <WeeksBreakdown />

            <button
              type="button"
              className="primary"
              data-action="next"
              onClick={handleNext}
            >
              CONHECER O PLANO DE AULAS
            </button>
          </section>
        )}

        {/* STEP: Offer VSL */}
        {currentStep.type === 'offer-vsl' && (
          <section className="step offer-vsl" data-step="offer-vsl">
            <style>{`
              .plan-ready{text-align:center;color:#18181b;font-size:14px;line-height:1.3;margin:0 10px 4px}
              .vsl-urgent{text-align:center;color:#bd246d;font-size:15px;font-weight:800;line-height:1.3;margin:0 12px 8px}
              .vsl-frame{width:min(90vw,400px);max-width:100%;margin:8px auto 0;border-radius:16px;overflow:hidden;box-shadow:0 8px 22px #00000024}
              .offer-vsl .primary{margin-top:14px}
            `}</style>
            <p className="plan-ready">
              Assiste ao vídeo abaixo para entenderes como funciona e qual é o próximo passo. 👇
            </p>
            <p className="vsl-urgent">Assiste agora, antes que a promoção acabe.</p>

            <div className="vsl-frame">
              <VslPlayer
                id={OFFER_CONFIG.vslOfferId}
                scriptSrc={OFFER_CONFIG.vslOfferScript}
              />
            </div>

            <button
              type="button"
              className="primary"
              data-action="next"
              onClick={handleNext}
            >
              Quero ver a minha oferta
            </button>
          </section>
        )}

        {/* STEP: Final Sales Offer Page */}
        {currentStep.type === 'offer' && <OfferPage profile={profile} />}
      </main>

      <Footer
        onPrivacy={() => setShowPrivacy(true)}
        onRestart={handleRestart}
      />

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
}
