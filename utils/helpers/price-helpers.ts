export function parsePrice(value: string): number {
  return Number(value.replace(/[^\d.-]/g, ''));
}

export const toCents = (price: string): number =>
  Math.round(parsePrice(price) * 100);
