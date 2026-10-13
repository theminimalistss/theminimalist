import type { CSSProperties, RefObject } from 'react';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import type { Testimonial } from '@/types/testimonial';
import { placeEchoes, placeFloats, type FloatPlacement } from '@/utils/testimonialField';
import { TestimonialFrame } from './TestimonialFrame';

type Props = {
  testimonials: readonly Testimonial[];
  stageRef: RefObject<HTMLDivElement | null>;
  playing: boolean;
  onOpen: (index: number, element: HTMLElement) => void;
};

function floatProps(float: FloatPlacement | undefined) {
  return {
    'data-float': '',
    'data-x': float?.x,
    'data-z': float?.z,
    'data-speed': float?.speed,
    'data-offset': float?.offset,
    style: { '--fade': float?.fade ?? 1 } as CSSProperties,
  };
}

export function TestimonialRain({ testimonials, stageRef, playing, onOpen }: Props) {
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
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="testimonial-float testimonial-float--echo"
            {...floatProps(echoes[index])}
          >
            <TestimonialFrame
              testimonial={testimonial}
              number={index + 1}
              echo
              onOpen={(element) => onOpen(index, element)}
            />
          </div>
        ))}
      </div>
      <ul className="testimonial-space" aria-label="Client testimonials">
        {testimonials.map((testimonial, index) => (
          <li key={testimonial.id} className="testimonial-float" {...floatProps(floats[index])}>
            <TestimonialFrame
              testimonial={testimonial}
              number={index + 1}
              playing={playing}
              onOpen={(element) => onOpen(index, element)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
