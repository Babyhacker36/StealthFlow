/**
 * @fileOverview Gaussian Jitter Logic
 * Provides human-mimicry timing distributions for outreach actions.
 */

/**
 * Generates a random number following a normal (Gaussian) distribution.
 * @param mean The average value.
 * @param stdev The standard deviation (spread).
 * @returns A random number based on the distribution.
 */
function gaussianRandom(mean: number, stdev: number): number {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Calculates a "human" delay in milliseconds.
 * @param target The target mean delay in seconds.
 * @param intensity The variance intensity (0.1 to 1.0).
 * @returns Delay in milliseconds.
 */
export function getHumanDelay(target: number = 4.5, intensity: number = 0.5): number {
  const stdev = target * intensity;
  const delay = gaussianRandom(target, stdev);
  // Ensure we don't return negative or impossibly short delays
  return Math.max(delay, 0.5) * 1000;
}

/**
 * Checks if the current time falls within standard business hours (9 AM - 5 PM).
 * @returns True if within business hours and not a weekend.
 */
export function isBusinessHours(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  const hour = now.getHours();

  const isWeekend = day === 0 || day === 6;
  const isOfficeHours = hour >= 9 && hour < 17;

  return !isWeekend && isOfficeHours;
}
