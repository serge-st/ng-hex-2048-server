import { ColorsType } from '../types';

export const PRIMARY_COLORS: ColorsType = {
  basic: {
    color: '#fff',
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  hover: {
    backgroundColor: '#0b5ed7',
    borderColor: '#0a58ca',
  },
  active: {
    backgroundColor: '#0a58ca',
    borderColor: '#0a53be',
  },
  disabled: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
    color: '#fff',
  },
} as const;
