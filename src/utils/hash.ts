export function hashStringToUnit(value: string): number {
  'worklet';
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1000;
  }
  return hash / 1000;
}
