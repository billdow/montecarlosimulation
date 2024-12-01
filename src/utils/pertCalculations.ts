export function calculatePertEstimate(optimistic: number, mostLikely: number, pessimistic: number): number {
  return (optimistic + 4 * mostLikely + pessimistic) / 6;
}

export function calculatePertStandardDeviation(optimistic: number, pessimistic: number): number {
  return (pessimistic - optimistic) / 6;
}

export function generateRandomNormal(): number {
  let u1 = 0;
  let u2 = 0;
  
  // Avoid zero values
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}