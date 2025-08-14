import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { XRaySignal } from '../database/models/xray-signal.model';
import { SaveSignalDto } from './dtos/save-signal.dto';
import { plainToInstance } from 'class-transformer';
import { SignalQueryFilterDto } from './dtos/signal-query-filter.dto';
import { validate } from 'class-validator';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class SignalService {
  constructor(
    @InjectModel(XRaySignal.name) private xraySignalModel: Model<XRaySignal>,
  ) {}

  async saveSignal(signal: SaveSignalDto) {
    // Validate signal
    const signalInstance = plainToInstance(SaveSignalDto, signal);
    const errors = await validate(signalInstance);
    if (Array.isArray(errors) && errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { deviceId, time, data } = signal;
    const dataVolume = Buffer.byteLength(JSON.stringify(data));
    const xraySignal = await this.xraySignalModel.create({
      deviceId,
      time,
      dataLength: data.length,
      dataVolume,
      rawData: data,
    });
    return xraySignal;
  }

  async findAll(signalFilter: SignalQueryFilterDto, pagination: PaginationDto) {
    const query = this.buildQuery(signalFilter);
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const [signals, total] = await Promise.all([
      this.xraySignalModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ [signalFilter.sortBy]: signalFilter.sortOrder })
        .exec(),
      this.xraySignalModel.countDocuments(query).exec(),
    ]);
    return {
      signals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteAll(signalFilter: SignalQueryFilterDto) {
    const query = this.buildQuery(signalFilter);
    return this.xraySignalModel.deleteMany(query).exec();
  }

  async findOne(id: string) {
    return this.xraySignalModel.findById(id).exec();
  }

  async deleteOne(id: string) {
    return this.xraySignalModel.findByIdAndDelete(id).exec();
  }

  buildQuery(signalFilter: SignalQueryFilterDto): FilterQuery<XRaySignal> {
    const {
      deviceId,
      timeStart,
      timeEnd,
      dataVolumeMin,
      dataVolumeMax,
      dataLengthMin,
      dataLengthMax,
    } = signalFilter;
    const query: FilterQuery<XRaySignal> = {};
    if (deviceId) {
      query.deviceId = deviceId;
    }
    if (timeStart || timeEnd) {
      query.time = { $gte: timeStart, $lte: timeEnd };
    }
    if (dataVolumeMin || dataVolumeMax) {
      query.dataVolume = { $gte: dataVolumeMin, $lte: dataVolumeMax };
    }
    if (dataLengthMin || dataLengthMax) {
      query.dataLength = { $gte: dataLengthMin, $lte: dataLengthMax };
    }
    return query;
  }
}
