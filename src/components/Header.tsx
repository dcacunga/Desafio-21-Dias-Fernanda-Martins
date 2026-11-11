interface HeaderProps {
  progressPct: number;
  showBack: boolean;
  onBack: () => void;
}

export function Header({ progressPct, showBack, onBack }: HeaderProps) {
  return (
    <>
      <div aria-hidden="true" className="top-progress">
        <i id="top-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <header className="header">
        {showBack ? (
          <button
            type="button"
            aria-label="Voltar à pergunta anterior"
            className="back"
            id="back"
            onClick={onBack}
          >
            ←
          </button>
        ) : (
          <span />
        )}
        <img
          alt="Fernanda Martins · Aulas sem sair de casa"
          height="128"
          src="/assets/logo-fernanda-negra-CJr91Wsx.webp"
          width="128"
        />
        <span />
      </header>
    </>
  );
}
