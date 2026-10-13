import type { CSSProperties } from 'react';

const WORDS = [
  { word: 'smooth', x: 8, y: 22, size: 1.2, delay: 0 },
  { word: 'patient', x: 62, y: 14, size: 0.9, delay: -6 },
  { word: 'classy', x: 78, y: 46, size: 1.35, delay: -11 },
  { word: 'attentive', x: 34, y: 40, size: 0.8, delay: -3 },
  { word: '100/10', x: 52, y: 70, size: 1.1, delay: -14 },
  { word: 'accommodating', x: 18, y: 62, size: 0.75, delay: -8 },
  { word: 'worth it', x: 70, y: 84, size: 0.95, delay: -17 },
  { word: 'professional', x: 40, y: 92, size: 0.7, delay: -4 },
] as const;

export function TestimonialBackdrop() {
  return (
    <div className="testimonial-backdrop" aria-hidden="true">
      <span className="testimonial-backdrop-sun" />
      <span className="testimonial-backdrop-quote">“</span>
      {WORDS.map(({ word, x, y, size, delay }) => (
        <span
          key={word}
          className="testimonial-backdrop-word"
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              '--size': size,
              animationDelay: `${delay}s`,
            } as CSSProperties
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}
