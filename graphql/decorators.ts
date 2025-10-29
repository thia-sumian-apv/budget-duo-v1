// Minimal passthrough decorator used to align with NeuroVibes structure.
// Wraps every resolver; extend here if you need standardized behavior.
export const withTrailing = <T extends (...args: any[]) => any>(
  resolver: T,
): T => {
  return ((...args: any[]) => resolver(...args)) as unknown as T;
};

export default withTrailing;
