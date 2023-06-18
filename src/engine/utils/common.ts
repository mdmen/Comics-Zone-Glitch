export function isEmpty(
  value: unknown[] | Set<unknown> | Map<unknown, unknown>
): boolean {
  return Array.isArray(value) ? !value.length : !value.size;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}