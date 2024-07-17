export const LINK_STYLE_TYPE = {
  PRIMARY_BTN: 'primary-btn',
  UNDERLINE: 'underline',
} as const;

export type LinkStyleType = ObjectValues<typeof LINK_STYLE_TYPE>;
