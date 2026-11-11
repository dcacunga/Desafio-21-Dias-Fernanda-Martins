interface FooterProps {
  onPrivacy: () => void;
  onRestart: () => void;
}

export function Footer({ onPrivacy, onRestart }: FooterProps) {
  return (
    <footer className="footer">
      <span>Fernanda Martins · Desafio 21 Dias</span>
      <div>
        <button type="button" data-action="privacy" onClick={onPrivacy}>
          Privacidade
        </button>
        <span>·</span>
        <button type="button" data-action="restart" onClick={onRestart}>
          Recomeçar
        </button>
      </div>
    </footer>
  );
}
