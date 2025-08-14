import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRaySignal } from '../database/models/xray-signal.model';
import { SaveSignalDto } from './dtos/save-signal.dto';

@Injectable()
export class SignalService {
  constructor(
    @InjectModel(XRaySignal.name) private xraySignalModel: Model<XRaySignal>,
  ) {}

  async saveSignal(signal: SaveSignalDto) {
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
}
