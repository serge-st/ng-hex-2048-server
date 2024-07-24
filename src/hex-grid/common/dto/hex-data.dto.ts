import { IsNumber, IsNotEmpty } from 'class-validator';

export class HexDataDTO {
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
  @IsNotEmpty()
  value: number;
}
