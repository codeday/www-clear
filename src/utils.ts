export function allDefined(...values: any[]): boolean {
  return !values.includes(undefined);
}

export function camelToTilte(string: string): string {
  // https://stackoverflow.com/a/7225450
  const result = string.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
