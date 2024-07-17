type ColorProperties = {
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  boxShadowRGB?: string;
};

export type ColorType = {
  basic: ColorProperties;
  hover: ColorProperties;
  active: ColorProperties;
  focus: ColorProperties;
  disabled: ColorProperties;
};
