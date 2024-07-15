type ColorProperties = {
  backgroundColor: string;
  borderColor: string;
  color?: string;
};

export type ColorsType = {
  basic: ColorProperties;
  hover: ColorProperties;
  active: ColorProperties;
  disabled: ColorProperties;
};
