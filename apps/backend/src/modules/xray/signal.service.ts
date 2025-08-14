import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { XRaySignal } from '../database/models/xray-signal.model';
import { SaveSignalDto } from './dtos/save-signal.dto';
import { plainToInstance } from 'class-transformer';
import { SignalQueryFilterDto } from './dtos/signal-query-filter.dto';
import { validate } from 'class-validator';

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
    const xraySignal = new this.xraySignalModel({
      deviceId,
      time,
      dataLength: data.length,
      dataVolume,
      rawData: data,
    });
    await xraySignal.save();
  }

  async findAll(signalFilter: SignalQueryFilterDto) {
    const query = this.buildQuery(signalFilter);
    return this.xraySignalModel.find(query).exec();
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
    if (timeStart) {
      query.time = { $gte: timeStart };
    }
    if (timeEnd) {
      query.time = { $lte: timeEnd };
    }
    if (dataVolumeMin) {
      query.dataVolume = { $gte: dataVolumeMin };
    }
    if (dataVolumeMax) {
      query.dataVolume = { $lte: dataVolumeMax };
    }
    if (dataLengthMin) {
      query.dataLength = { $gte: dataLengthMin };
    }
    if (dataLengthMax) {
      query.dataLength = { $lte: dataLengthMax };
    }
    return query;
  }
}
