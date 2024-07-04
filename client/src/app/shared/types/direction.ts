import { DIRECTION } from '../constants/directions';

export type DirectionKey = keyof typeof DIRECTION;
export type Direction = ObjectValues<typeof DIRECTION>;
