import { ColorType } from '../types';

export const SECONDARY_COLORS: ColorType = {
  basic: {
    color: '#000',
    backgroundColor: '#f8f9fa',
    borderColor: '#f8f9fa',
  },
  hover: {
    backgroundColor: '#d3d4d5',
    borderColor: '#c6c7c8',
  },
  active: {
    backgroundColor: '#c6c7c8',
    borderColor: '#babbbc',
  },
  focus: {
    backgroundColor: '#d3d4d5',
    borderColor: '#c6c7c8',
    boxShadowRGB: '211 212 213',
  },
  disabled: {
    color: '#a0a1a2',
    backgroundColor: '#f8f9fa',
    borderColor: '#f8f9fa',
  },
} as const;
