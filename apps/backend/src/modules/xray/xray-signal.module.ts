import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  XRaySignal,
  XRaySignalSchema,
} from '../database/models/xray-signal.model';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: XRaySignal.name, schema: XRaySignalSchema },
    ]),
  ],
  controllers: [],
  providers: [SignalService],
  exports: [SignalService],
})
export class XrayModule {}
