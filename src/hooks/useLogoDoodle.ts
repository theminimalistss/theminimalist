import { useEffect, useRef } from 'react';
import { LOGO_DOODLE } from '@/constants/motion';

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export function useLogoDoodle<T extends HTMLElement>(filterId: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const mark = ref.current;
    const link = mark?.closest('a');
    const svg = mark?.querySelector<SVGSVGElement>('.studio-mark');
    const noise = document.getElementById(filterId)?.querySelector('feTurbulence');
    const warp = document.getElementById(filterId)?.querySelector('feDisplacementMap');
    if (!mark || !link || !svg || !noise || !warp) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const { boil, sway } = LOGO_DOODLE;
    let frame = 0;
    let last = 0;
    let hovering = false;
    let energy = 0;
    let angle = 0;
    let spin = 0;
    let seed = 1;
    let nextBoil = 0;
    let lastScroll = window.scrollY;
    let filtered = false;
    let written = '';
    let wheelCheck = 0;
    const setSway = (value: string) => {
      if (value === written) return;
      written = value;
      mark.style.setProperty('--logo-sway', value);
    };

    const step = (time: number) => {
      frame = 0;
      const seconds = last ? Math.min(0.05, (time - last) / 1_000) : 1 / 60;
      last = time;
      energy *= Math.exp(-seconds / boil.decay);
      const wobble = Math.max(hovering ? 1 : 0, Math.min(1, energy));
      spin += (-sway.stiffness * angle - sway.damping * spin) * seconds;
      angle += spin * seconds;
      setSway(angle.toFixed(2));
      const boiling = wobble > 0.02;
      if (boiling !== filtered) {
        filtered = boiling;
        svg.style.filter = boiling ? `url(#${filterId})` : '';
      }
      if (boiling && time >= nextBoil) {
        warp.setAttribute('scale', (boil.scale * wobble).toFixed(1));
        seed = (seed % boil.frames) + 1;
        noise.setAttribute('seed', String(seed));
        nextBoil = time + boil.interval;
      }
      const settled = wobble <= 0.02 && Math.abs(angle) < 0.02 && Math.abs(spin) < 0.05;
      if (settled) {
        angle = spin = 0;
        setSway('0');
        last = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };
    const wake = () => {
      if (!frame && !reduced.matches) frame = requestAnimationFrame(step);
    };
    const nudge = (pixels: number) => {
      if (reduced.matches || !pixels) return;
      spin = clamp(spin + pixels * sway.push, sway.limit);
      energy = Math.min(1, energy + Math.abs(pixels) * boil.push);
      wake();
    };
    const scroll = () => {
      nudge(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
    };
    const wheel = (event: WheelEvent) => {
      if (wheelCheck) return;
      const before = window.scrollY;
      const delta = clamp(event.deltaY, 120) * 0.5;
      wheelCheck = requestAnimationFrame(() => {
        wheelCheck = 0;
        if (window.scrollY === before) nudge(delta);
      });
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovering = true;
      wake();
    };
    const leave = () => {
      hovering = false;
    };
    const press = () => {
      if (reduced.matches) return;
      energy = 1;
      wake();
      svg.animate(
        [
          { transform: 'scale(1, 1)' },
          { transform: 'scale(1.12, 0.88)', offset: 0.25 },
          { transform: 'scale(0.94, 1.08)', offset: 0.55 },
          { transform: 'scale(1, 1)' },
        ],
        { duration: 650, easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)' },
      );
      svg
        .querySelector('path')
        ?.animate(
          [
            { transform: 'translate(0, 0)' },
            { transform: 'translate(0, -70px)', offset: 0.4 },
            { transform: 'translate(0, 0)' },
          ],
          { duration: 700, easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)' },
        );
      mark.querySelectorAll<SVGPathElement>('.studio-logo-pop path').forEach((stroke, index) => {
        stroke.animate(
          [
            { strokeDashoffset: 1, opacity: 1 },
            { strokeDashoffset: 0, opacity: 1, offset: 0.45 },
            { strokeDashoffset: -1, opacity: 0 },
          ],
          { duration: 620, delay: index * 30, easing: 'ease-out' },
        );
      });
    };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('wheel', wheel, { passive: true });
    link.addEventListener('pointerenter', enter);
    link.addEventListener('pointerleave', leave);
    link.addEventListener('click', press);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(wheelCheck);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('wheel', wheel);
      link.removeEventListener('pointerenter', enter);
      link.removeEventListener('pointerleave', leave);
      link.removeEventListener('click', press);
      svg.style.filter = '';
      mark.style.removeProperty('--logo-sway');
    };
  }, [filterId]);

  return ref;
}
