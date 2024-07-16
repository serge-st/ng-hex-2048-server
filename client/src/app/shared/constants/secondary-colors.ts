import { ColorsType } from '../types';

export const SECONDARY_COLORS: ColorsType = {
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
    color: '#a0a1a2',
    backgroundColor: '#f8f9fa',
    borderColor: '#f8f9fa',
  },
} as const;
