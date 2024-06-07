import { HexData } from '../interfaces';

export type RequiredHexDataKey = Exclude<keyof HexData, 'value'>;
export type HexDataKey = keyof HexData;
