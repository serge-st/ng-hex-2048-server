import { GridUtilStyleVariables } from '../interfaces';

export const getCSSVariableString = (vars: Record<string, string | undefined> | GridUtilStyleVariables): string => {
  return Object.entries(vars)
    .map(([key, value]) => (value ? `--${key}: ${value};` : ''))
    .join(' ');
};
