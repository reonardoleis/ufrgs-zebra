export const redact = <T extends object, K extends keyof T>(value: T, keys: K[]): Omit<T, K> => {
  keys.forEach(key => {
    delete value[key];
  });
  return value as Omit<T, K>;
}
