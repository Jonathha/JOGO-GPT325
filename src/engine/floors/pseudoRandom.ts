/** Deterministic pseudo-random in [0,1) so textures never flicker between frames. */
export function pseudoRandom(a: number, b: number, n: number): number {
  const v = Math.sin(a * 127.1 + b * 311.7 + n * 74.7) * 43758.5453;
  return v - Math.floor(v);
}
