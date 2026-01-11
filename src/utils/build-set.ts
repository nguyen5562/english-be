export function buildSet(prefix: string, dto: Record<string, any>) {
  const set: Record<string, any> = {};

  Object.entries(dto).forEach(([key, value]) => {
    if (value !== undefined && key !== '_id') {
      set[`${prefix}${key}`] = value;
    }
  });

  return set;
}
