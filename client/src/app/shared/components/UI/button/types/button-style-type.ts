const BUTTON_STYLE_TYPE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export type ButtonStyleType = ObjectValues<typeof BUTTON_STYLE_TYPE>;
