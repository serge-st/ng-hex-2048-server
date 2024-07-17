export const getCSSVariableString = (vars: Record<string, string | undefined>): string => {
  return Object.entries(vars)
    .map(([key, value]) => (value ? `--${key}: ${value};` : ''))
    .join(' ');
};
