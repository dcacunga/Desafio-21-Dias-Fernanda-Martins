import { useState, useEffect } from 'react';

interface PhotoCarouselProps {
  kind: 'presentation' | 'analysis';
}

const PRESENTATION_SLIDES = [
  { img: '/media/result-rayane.webp', name: 'Rayane Costa' },
  { img: '/media/result-rita.webp', name: 'Rita de Cássia' },
  { img: '/media/result-tchissola.webp', name: 'Tchissola da Silva' },
  { img: '/media/result-helia.webp', name: 'Hélia Monteiro' },
];

const ANALYSIS_SLIDES = [
  { img: '/media/ext-10.webp', name: 'Resultados partilhados por uma aluna' },
  { img: '/media/ext-11.webp', name: 'Resultados partilhados por uma aluna' },
  { img: '/media/ext-12.webp', name: 'Resultados partilhados por uma aluna' },
];

export function PhotoCarousel({ kind }: PhotoCarouselProps) {
  const slides = kind === 'analysis' ? ANALYSIS_SLIDES : PRESENTATION_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={`photo-carousel ${kind}`} aria-label="Registos de evolução das alunas">
      <div
        className="photo-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform 0.4s ease-in-out',
        }}
      >
        {slides.map((s, idx) => (
          <article key={idx} className="photo-slide" aria-hidden={current !== idx}>
            <img
              src={s.img}
              alt={s.name.includes('aluna') ? s.name : `Antes e depois partilhado por ${s.name}`}
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }}
            />
          </article>
        ))}
      </div>
      <div className="photo-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={current === idx ? 'active' : ''}
            onClick={() => setCurrent(idx)}
            role="button"
            tabIndex={0}
            aria-label={`Ver foto ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
