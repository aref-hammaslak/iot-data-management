import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaveSignalDto {
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNotEmpty()
  @IsNumber()
  time: number;

  @IsNotEmpty()
  @IsArray()
  data: [number, [number, number, number]];
}

// example 
// {
//   "66bb584d4ae73e488c30a072": {
//     "data": [
//       [762, [51.33, 12.33, 1.20]],
//       [1766, [51.33, 12.33, 1.53]]
//     ],
//     "time": 1735683480000
//   }
// }