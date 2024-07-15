import { ColorsType } from '../types';

export const PRIMARY_COLORS: ColorsType = {
  // TODO: replace with actual colors
  basic: {
    backgroundColor: '#f8f9fa',
    borderColor: '#f8f9fa',
  },
  hover: {
    backgroundColor: '#d5d6d7',
    borderColor: '#babbbc',
  },
  active: {
    backgroundColor: '#d5d6d7',
    borderColor: '#a0a1a2',
  },
  disabled: {
    backgroundColor: '#f8f9fa',
    borderColor: '#f8f9fa',
    color: '#a0a1a2',
  },
} as const;
