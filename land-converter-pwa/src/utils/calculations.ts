export const SQFT_PER_MARLA_LEGAL = 225.0;
export const SQFT_PER_KANAL_LEGAL = 4500.0;
export const SQFT_PER_MARLA_LDA = 250.0;
export const SQFT_PER_KANAL_LDA = 5000.0;
export const SQFT_PER_MARLA_TRAD = 272.0;
export const SQFT_PER_KANAL_KPK = 5440.0;
export const SQFT_PER_SQ_KARAM = 30.25;

export function calculateHerons(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  const term = s * (s - a) * (s - b) * (s - c);
  if (term <= 0) return 0;
  return Math.sqrt(term);
}

export function calculateShoelace(points: { x: number, y: number }[]): number {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area) / 2.0;
}
