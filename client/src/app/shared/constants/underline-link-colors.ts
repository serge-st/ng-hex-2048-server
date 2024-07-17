import { ColorType } from '../types';

export const UNDERLINE_LINK_COLORS: ColorType = {
  basic: {
    color: '#0d6efd',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  hover: {
    color: '#0a58ca',
  },
  active: {},
  focus: {
    boxShadowRGB: '49 132 253',
  },
  disabled: {
    color: '#6c757d',
  },
} as const;
