import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'xray_signals',
})
export class XRaySignal {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  dataVolume: number;

  @Prop({ type: Array })
  rawData?: Array<[number, [number, number, number]]>;
}

export type XRaySignalDocument = XRaySignal & Document;
export const XRaySignalSchema = SchemaFactory.createForClass(XRaySignal);
