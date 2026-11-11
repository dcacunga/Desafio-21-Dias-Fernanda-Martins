import { useEffect, useRef } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute('open', '');
        }
      }
    } else {
      if (dialog.open) {
        try {
          dialog.close();
        } catch {
          dialog.removeAttribute('open');
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      id="privacy"
      style={{
        margin: 'auto',
        maxWidth: '540px',
        width: '90%',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e8e5e7',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        zIndex: 100,
      }}
      onClose={onClose}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
        As tuas respostas
      </h2>
      <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#333', marginBottom: '14px' }}>
        As respostas do questionário, o primeiro nome informado, a etapa alcançada, o tempo de visita
        e a origem do acesso são registrados para montar o teu resumo e analisar o funcionamento do
        quiz. Este site usa o pixel e o rastreamento UTM da UTMify para medir visitas e cliques de
        compra. Estes serviços podem utilizar cookies, identificadores de navegação e endereço IP.
        Não incluímos peso, altura ou respostas de saúde nos links de checkout nem nos eventos de
        publicidade.
      </p>
      <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#333', marginBottom: '20px' }}>
        O questionário organiza preferências e objetivos. Não faz diagnóstico nem substitui uma
        avaliação profissional.
      </p>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <button className="primary" type="submit">
          Fechar
        </button>
      </form>
    </dialog>
  );
}
