import { memo, useMemo, type CSSProperties, type RefObject } from 'react';
import { TESTIMONIAL_RAIN } from '@/constants/motion';
import type { Testimonial } from '@/types/testimonial';
import { placeEchoes, placeFloats, type FloatPlacement } from '@/utils/testimonialField';
import { TestimonialFrame } from './TestimonialFrame';

type Props = {
  testimonials: readonly Testimonial[];
  stageRef: RefObject<HTMLDivElement | null>;
  seed: number;
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

export const TestimonialRain = memo(function TestimonialRain({
  testimonials,
  stageRef,
  seed,
  playing,
  onOpen,
}: Props) {
  const floats = useMemo(() => placeFloats(testimonials.length, seed), [testimonials.length, seed]);
  const echoes = useMemo(
    () => placeEchoes(testimonials.length, seed + 12),
    [testimonials.length, seed],
  );
  const field = {
    '--field-perspective': `${TESTIMONIAL_RAIN.perspective}px`,
    '--field-horizon': `${TESTIMONIAL_RAIN.horizon * 100}%`,
  } as CSSProperties;
  return (
    <>
      <div className="testimonial-scenery" data-layer="" aria-hidden="true" style={field}>
        <div className="testimonial-floor" />
        <div className="testimonial-echoes">
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
      </div>
      <div ref={stageRef} className="testimonial-rain" data-layer="" style={field}>
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
    </>
  );
});
