import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'The page number (starts from 1)',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;
}
