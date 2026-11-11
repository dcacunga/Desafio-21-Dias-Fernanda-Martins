import React, { useEffect, useRef } from 'react';

interface VslPlayerProps {
  id: string;
  scriptSrc: string;
  paddingTop?: string;
  className?: string;
}

export function VslPlayer({
  id,
  scriptSrc,
  paddingTop = '178.21782178217822% 0 0',
  className = '',
}: VslPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script already appended
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      // Pause any playing audio/video on unmount
      const player = document.getElementById(id);
      if (player) {
        try {
          if (typeof (player as any).pause === 'function') {
            (player as any).pause();
          }
        } catch {}
        player.querySelectorAll?.('video, audio').forEach((el) => {
          try {
            (el as HTMLMediaElement).pause();
          } catch {}
        });
        if (player.shadowRoot) {
          player.shadowRoot.querySelectorAll?.('video, audio').forEach((el) => {
            try {
              (el as HTMLMediaElement).pause();
            } catch {}
          });
        }
      }
    };
  }, [id, scriptSrc]);

  return (
    <div ref={containerRef} className={`vsl-container ${className}`}>
      {React.createElement(
        'vturb-smartplayer',
        {
          id,
          style: {
            display: 'block',
            margin: '0 auto',
            width: '100%',
            maxWidth: '400px',
          },
        },
        <div
          className="vturb-player-placeholder"
          style={{
            position: 'relative',
            width: '100%',
            padding: paddingTop,
            zIndex: 0,
            backgroundColor: 'black',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              background: 'radial-gradient(circle at center, #2d132c 0%, #0d040e 100%)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(236, 72, 153, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(236, 72, 153, 0.6)',
                marginBottom: '16px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <strong style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Vídeo Explicativo
            </strong>
            <span style={{ fontSize: '13px', color: '#fda4af' }}>
              Professora Fernanda Martins
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
