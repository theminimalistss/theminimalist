import { useEffect, useRef } from 'react';
import { COMPACT_QUERY, LOADER, MOTION } from '@/constants/motion';
import { LOADER_SHADER } from '@/shaders/loader';
import { clamp01 } from '@/utils/easing';
import { LOTUS_FONT, paintLotusArtwork, type LotusArtwork } from '@/utils/lotusArtwork';
import {
  createFullscreenScene,
  fitCanvas,
  getPixelRatio,
  readColorToken,
  type FullscreenScene,
} from '@/utils/webgl';

type Options = { ready: boolean; animated: boolean; onExited: () => void };

function uploadArtwork(scene: FullscreenScene, texture: WebGLTexture, artwork: LotusArtwork) {
  const { gl } = scene;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, artwork.source);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform2f(scene.uniform('u_logoBase'), ...artwork.base);
  gl.uniform1f(scene.uniform('u_logoReach'), artwork.reach);
  gl.uniform2f(scene.uniform('u_logoTexel'), 1 / artwork.width, 1 / artwork.height);
}

export function useLoaderScene({ ready, animated, onExited }: Options) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  const exitedRef = useRef(onExited);

  useEffect(() => {
    readyRef.current = ready;
    exitedRef.current = onExited;
  });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    document.getElementById('boot-splash')?.remove();
    const scene = animated ? createFullscreenScene(canvas, LOADER_SHADER) : null;
    const texture = scene?.gl.createTexture();
    if (!scene || !texture) {
      root.dataset.renderer = 'static';
      return;
    }

    const { gl } = scene;
    const compactQuery = window.matchMedia(COMPACT_QUERY);
    let artwork: LotusArtwork | null = null;
    let bloomStart: number | null = null;
    let exitStart: number | null = null;
    let frame = 0;
    let disposed = false;
    let lost = false;

    gl.uniform1i(scene.uniform('u_logo'), 0);
    gl.uniform3fv(scene.uniform('u_ink'), readColorToken('--color-loader-ink'));
    gl.uniform3fv(scene.uniform('u_base'), readColorToken('--color-loader'));
    gl.uniform3fv(scene.uniform('u_deep'), readColorToken('--color-loader-deep'));
    gl.uniform3fv(scene.uniform('u_light'), readColorToken('--color-loader-light'));

    const paint = () => {
      artwork = paintLotusArtwork(compactQuery.matches, getPixelRatio());
      if (artwork) uploadArtwork(scene, texture, artwork);
    };
    const fontTimer = window.setTimeout(() => !artwork && paint(), LOADER.fontTimeout);
    void (document.fonts?.load(LOTUS_FONT) ?? Promise.resolve()).then(
      () => !disposed && !artwork && paint(),
      () => !disposed && !artwork && paint(),
    );
    const repaint = () => artwork && paint();
    compactQuery.addEventListener('change', repaint);

    const render = (time: number) => {
      fitCanvas(canvas, window.innerWidth, window.innerHeight);
      const ratio = canvas.width / window.innerWidth;
      if (artwork && bloomStart === null) bloomStart = time;
      const bloom = bloomStart === null ? 0 : clamp01((time - bloomStart) / LOADER.bloomDuration);
      if (readyRef.current && bloom >= 1 && exitStart === null) exitStart = time;
      const exit = exitStart === null ? 0 : clamp01((time - exitStart) / LOADER.exitDuration);

      gl.uniform2f(scene.uniform('u_resolution'), canvas.width, canvas.height);
      gl.uniform4f(
        scene.uniform('u_logoRect'),
        canvas.width / 2,
        canvas.height / 2,
        (artwork?.width ?? 1) * ratio,
        (artwork?.height ?? 1) * ratio,
      );
      gl.uniform1f(scene.uniform('u_time'), time / 1000);
      gl.uniform1f(scene.uniform('u_bloom'), bloom);
      gl.uniform1f(scene.uniform('u_exit'), exit);
      scene.draw();
      root.dataset.renderer = 'webgl';
      return exit >= 1;
    };

    let lastTime = 0;
    let clock = 0;
    const tick = (time: number) => {
      clock += lastTime ? Math.min(time - lastTime, MOTION.maxFrameDelta) : 0;
      lastTime = time;
      if (render(clock)) {
        exitedRef.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const handleLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      root.dataset.renderer = 'static';
      if (readyRef.current) exitedRef.current();
    };
    canvas.addEventListener('webglcontextlost', handleLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(fontTimer);
      compactQuery.removeEventListener('change', repaint);
      canvas.removeEventListener('webglcontextlost', handleLost);
      if (!lost) {
        gl.deleteTexture(texture);
        scene.dispose();
      }
    };
  }, [animated]);

  useEffect(() => {
    if (!ready || rootRef.current?.dataset.renderer !== 'static') return;
    const timer = window.setTimeout(
      () => exitedRef.current(),
      animated ? LOADER.staticExitDuration : 0,
    );
    return () => window.clearTimeout(timer);
  }, [ready, animated]);

  return { rootRef, canvasRef };
}
