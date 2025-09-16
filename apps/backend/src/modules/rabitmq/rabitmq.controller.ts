import { BadRequestException, Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SaveSignalDto } from '../xray/dtos/save-signal.dto';
import { SignalService } from '../xray/signal.service';

@Controller()
export class RabitmqController {
  constructor(private readonly signalService: SignalService) {}

  @EventPattern('x-ray-signal')
  async handleXRay(@Payload() data: SaveSignalDto) {
    console.log('Received message from x-ray queue', data);
    try {
      await this.signalService.saveSignal(data);
    } catch (error: any) {
      console.error('Error saving signal', error);
      throw new BadRequestException('Error saving signal', error.message);
    }
    return {
      status: 'success',
      message: 'Signal saved successfully',
    };
  }
}
