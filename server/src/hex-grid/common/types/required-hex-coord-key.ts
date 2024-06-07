import { HexCoordDTO } from '../dto';

export type RequiredHexCoordKey = Exclude<keyof HexCoordDTO, 'value'>;
