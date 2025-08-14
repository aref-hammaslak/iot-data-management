import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SignalService } from './signal.service';
import { SaveSignalDto } from './dtos/save-signal.dto';
import { SignalQueryFilterDto } from './dtos/signal-query-filter.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiExtraModels(SignalQueryFilterDto, SaveSignalDto)
@Controller('xray-signal')
export class XraySignalController {
  constructor(private readonly signalService: SignalService) {}

  @ApiOperation({ summary: 'Create a new signal' })
  @ApiBody({ type: SaveSignalDto })
  @ApiResponse({ status: 201, description: 'Signal created successfully' })
  @Post()
  async create(@Body() saveSignalDto: SaveSignalDto) {
    await this.signalService.saveSignal(saveSignalDto);
    return {
      status: 'success',
      message: 'Signal saved successfully',
    };
  }

  @ApiQuery({
    name: 'signalQueryFilter',
    required: false,
    style: 'deepObject',
    explode: true,
    schema: { $ref: getSchemaPath(SignalQueryFilterDto) },
  })
  @ApiOperation({ summary: 'Get all signals' })
  @ApiResponse({ status: 200, description: 'Signals fetched successfully' })
  @Get()
  async findAll(
    @Query('signalQueryFilter') signalQueryFilter: SignalQueryFilterDto,
  ) {
    const signals = await this.signalService.findAll(signalQueryFilter);
    if (signals.length === 0) {
      throw new NotFoundException('No signals found');
    }
    return {
      status: 'success',
      data: signals,
      message: 'Signals fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Delete all signals' })
  @ApiQuery({
    name: 'signalQueryFilter',
    required: false,
    style: 'deepObject',
    explode: true,
    schema: { $ref: getSchemaPath(SignalQueryFilterDto) },
  })
  @ApiResponse({ status: 200, description: 'Signals deleted successfully' })
  @Delete()
  async deleteAll(
    @Query('signalQueryFilter') signalQueryFilter: SignalQueryFilterDto,
  ) {
    const signals = await this.signalService.deleteAll(signalQueryFilter);
    if (signals.deletedCount === 0) {
      throw new NotFoundException('No signals found');
    }
    return {
      status: 'success',
      message: `${signals.deletedCount} signals deleted successfully`,
    };
  }

  @ApiOperation({ summary: 'Get a signal by id' })
  @ApiResponse({ status: 200, description: 'Signal fetched successfully' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const signal = await this.signalService.findOne(id);
    if (!signal) {
      throw new NotFoundException('Signal not found');
    }
    return {
      status: 'success',
      data: signal,
      message: 'Signal fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Delete a signal by id' })
  @ApiResponse({ status: 200, description: 'Signal deleted successfully' })
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const signal = await this.signalService.deleteOne(id);
    if (!signal) {
      throw new NotFoundException('Signal not found');
    }
    return {
      status: 'success',
      message: 'Signal deleted successfully',
    };
  }
}
