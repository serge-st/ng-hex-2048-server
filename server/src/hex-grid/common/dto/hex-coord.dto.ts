import { OmitType } from '@nestjs/mapped-types';
import { HexDataDTO } from './hex-data.dto';

export class HexCoordDTO extends OmitType(HexDataDTO, ['value'] as const) {}
