import type { CSSProperties, RefObject } from 'react';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import type { Testimonial } from '@/types/testimonial';
import { placeEchoes, placeFloats } from '@/utils/testimonialField';
import { TestimonialFrame } from './TestimonialFrame';

type Props = {
  testimonials: readonly Testimonial[];
  stageRef: RefObject<HTMLDivElement | null>;
  onOpen: (index: number, element: HTMLElement) => void;
};

export function TestimonialRain({ testimonials, stageRef, onOpen }: Props) {
  const floats = placeFloats(testimonials.length);
  const echoes = placeEchoes(testimonials.length);
  return (
    <div
      ref={stageRef}
      className="testimonial-rain"
      style={
        {
          '--field-perspective': `${TESTIMONIAL_RAIN.perspective}px`,
          '--field-horizon': `${TESTIMONIAL_RAIN.horizon * 100}%`,
        } as CSSProperties
      }
    >
      <div className="testimonial-floor" aria-hidden="true" />
      <div className="testimonial-echoes" aria-hidden="true">
        {testimonials.map((testimonial, index) => {
          const echo = echoes[index];
          return (
            <div
              key={testimonial.id}
              className="testimonial-float testimonial-float--echo"
              data-float=""
              data-x={echo?.x}
              data-z={echo?.z}
              data-speed={echo?.speed}
              data-offset={echo?.offset}
              style={{ '--fade': echo?.fade ?? 0.3 } as CSSProperties}
            >
              <TestimonialFrame
                testimonial={testimonial}
                tone={echo?.tone ?? 0}
                echo
                onOpen={() => {}}
              />
            </div>
          );
        })}
      </div>
      <ul className="testimonial-space" aria-label="Client testimonials">
        {testimonials.map((testimonial, index) => {
          const float = floats[index];
          return (
            <li
              key={testimonial.id}
              className="testimonial-float"
              data-float=""
              data-x={float?.x}
              data-z={float?.z}
              style={{ '--fade': float?.fade ?? 1 } as CSSProperties}
              data-speed={float?.speed}
              data-offset={float?.offset}
            >
              <TestimonialFrame
                testimonial={testimonial}
                tone={float?.tone ?? 0}
                onOpen={(element) => onOpen(index, element)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
