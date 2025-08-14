import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';

export class SaveSignalDto {
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNotEmpty()
  @IsNumber()
  time: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Validate(
    (_, value) => {
      if (!Array.isArray(value)) return false;
      // value should be an array of [number, [number, number, number]]
      return value.every((item) => {
        console.log(item);
        return (
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === 'number' &&
          Array.isArray(item[1]) &&
          item[1].length === 3 &&
          item[1].every((n) => typeof n === 'number')
        );
      });
    },
    {
      message:
        'Each data entry must be a tuple [number, [number, number, number]]',
    },
  )
  data: [number, [number, number, number]][];
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
