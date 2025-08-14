import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class SignalQueryFilterDto {
  @ApiPropertyOptional({
    description: 'Device ID to filter signals',
    example: 'device123',
  })
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'Start time for filtering signals (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  timeStart?: string;

  @ApiPropertyOptional({
    description: 'End time for filtering signals (ISO 8601 format)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  timeEnd?: string;

  @ApiPropertyOptional({ description: 'Minimum data volume', example: 10 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  dataVolumeMin?: number;

  @ApiPropertyOptional({ description: 'Maximum data volume', example: 100 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  dataVolumeMax?: number;

  @ApiPropertyOptional({ description: 'Minimum data length', example: 5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  dataLengthMin?: number;

  @ApiPropertyOptional({ description: 'Maximum data length', example: 50 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  dataLengthMax?: number;

  @ApiPropertyOptional({ description: 'Sort by', example: 'time' })
  @IsOptional()
  @IsString()
  @IsIn(['time', 'dataVolume', 'dataLength'])
  sortBy: 'time' | 'dataVolume' | 'dataLength' = 'time';

  @ApiPropertyOptional({ description: 'Sort order', example: 'asc' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
