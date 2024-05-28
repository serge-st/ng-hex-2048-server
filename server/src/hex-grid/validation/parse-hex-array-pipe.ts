import { Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { ParseArrayPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { HexCoordDTO } from '../common/dto';

@Injectable()
export class ParseHexArrayPipe extends ParseArrayPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    const arrayValue = await super.transform(value, metadata);

    for (const item of arrayValue) {
      const hexCoordDto = plainToClass(HexCoordDTO, item);
      const errors = await validate(hexCoordDto);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      if (hexCoordDto.r + hexCoordDto.s + hexCoordDto.q !== 0) {
        throw new BadRequestException('Incorrect coord found: Sum of "q", "r", and "s" must equal 0');
      }
    }

    return arrayValue;
  }
}
