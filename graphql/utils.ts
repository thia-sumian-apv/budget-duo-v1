export const mapValues = <TValue, TMapped>(
  mapper: (value: TValue, key: string) => TMapped,
  input: Record<string, TValue>,
): Record<string, TMapped> => {
  const entries = Object.entries(input).map(
    ([key, value]) => [key, mapper(value as TValue, key)] as const,
  );
  return Object.fromEntries(entries) as Record<string, TMapped>;
};
