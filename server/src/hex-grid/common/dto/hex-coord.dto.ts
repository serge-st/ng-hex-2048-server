import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class HexCoordDTO {
  @IsNumber({}, { message: '"q" must be a number' })
  @IsNotEmpty()
  q: number;

  @IsNumber({}, { message: '"r" must be a number' })
  @IsNotEmpty()
  r: number;

  @IsNumber({}, { message: '"s" must be a number' })
  @IsNotEmpty()
  s: number;

  @IsNumber({}, { message: '"value" must be a number' })
  @IsOptional()
  value?: number;
}
