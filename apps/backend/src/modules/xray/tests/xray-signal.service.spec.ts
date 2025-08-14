import { Test, TestingModule } from '@nestjs/testing';
import { SignalService } from '../signal.service';
import { getModelToken } from '@nestjs/mongoose';
import { XRaySignal } from '../../database/models/xray-signal.model';
import { Model } from 'mongoose';
import { SaveSignalDto } from '../dtos/save-signal.dto';
import { SignalQueryFilterDto } from '../dtos/signal-query-filter.dto';
import { PaginationDto } from '../dtos/pagination.dto';

describe('SignalService', () => {
  let service: SignalService;
  let xraySignalModel: jest.Mocked<Model<XRaySignal>>;

  beforeEach(async () => {
    // Create mock functions for the query chain
    const mockSkip = jest.fn();
    const mockLimit = jest.fn();
    const mockSort = jest.fn();
    const mockExec = jest.fn();

    // Create the query chain object
    const mockQueryChain = {
      skip: mockSkip.mockReturnThis(),
      limit: mockLimit.mockReturnThis(),
      sort: mockSort.mockReturnThis(),
      exec: mockExec,
    };

    const mockedXraySignalModel = {
      constructor: jest.fn(),
      find: jest.fn().mockReturnValue(mockQueryChain),
      findOne: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      save: jest.fn(),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      deleteMany: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalService,
        {
          provide: getModelToken(XRaySignal.name),
          useValue: mockedXraySignalModel,
        },
      ],
    }).compile();

    service = module.get<SignalService>(SignalService);
    xraySignalModel = module.get<jest.Mocked<Model<XRaySignal>>>(
      getModelToken(XRaySignal.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save signal', () => {
    it('should process the signal correctly', async () => {
      // arrange
      const signalDto: SaveSignalDto = {
        deviceId: '123',
        time: 123,
        data: [
          [1, [1, 2, 3]],
          [2, [4, 5, 6]],
        ],
      };
      const processedSignal = {
        deviceId: '123',
        time: 123,
        dataLength: 2,
        dataVolume: Buffer.byteLength(JSON.stringify(signalDto.data)),
        rawData: [
          [1, [1, 2, 3]],
          [2, [4, 5, 6]],
        ],
      };

      // act
      await service.saveSignal(signalDto);

      // assert
      expect(xraySignalModel.create).toHaveBeenCalledWith(processedSignal);
    });

    it('should find all signals', async () => {
      // arrange
      const signalFilter = new SignalQueryFilterDto();
      const pagination = new PaginationDto();
      const signals = [
        {
          deviceId: '123',
          time: 123,
          dataLength: 2,
          dataVolume: 25,
          rawData: [
            [1, [1, 2, 3]],
            [2, [4, 5, 6]],
          ],
        },
      ];
      const total = 1;

      xraySignalModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(signals),
      });

      xraySignalModel.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      // act
      const result = await service.findAll(signalFilter, pagination);

      // assert
      expect(result).toEqual({
        signals,
        total,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('find all signals', () => {
    it('should handle pagination correctly', async () => {
      // arrange
      const signalFilter: SignalQueryFilterDto = {
        sortBy: 'time',
        sortOrder: 'asc',
      };
      const pagination: PaginationDto = {
        page: 3,
        limit: 5,
      };
      const total = 0;
      const queryChain = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };
      xraySignalModel.find = jest.fn().mockReturnValue(queryChain);
      xraySignalModel.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      // act
      await service.findAll(signalFilter, pagination);

      // assert
      expect(queryChain.skip).toHaveBeenCalledWith(10);
      expect(queryChain.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('delete all signals', () => {
    it('should delete all signals', async () => {
      // arrange
      const signalFilter = new SignalQueryFilterDto();
      // act
      await service.deleteAll(signalFilter);
      // assert
      expect(xraySignalModel.deleteMany).toHaveBeenCalled();
    });
  });

  describe('find one signal', () => {
    it('should find one signal', async () => {
      // arrange
      const signalId = '123';

      // act
      await service.findOne(signalId);

      // assert
      expect(xraySignalModel.findById).toHaveBeenCalledWith(signalId);
    });
  });

  describe('query builder', () => {
    it('should include the dataVolume field in the query', () => {
      // arrange
      const signalFilter = new SignalQueryFilterDto();
      signalFilter.dataVolumeMin = 123;
      signalFilter.dataVolumeMax = 456;

      // act
      const query = service.buildQuery(signalFilter);

      // assert
      expect(query.dataVolume).toEqual({ $gte: 123, $lte: 456 });
    });

    it('should include the dataVolume field in the query', () => {
      // arrange
      const signalFilter = new SignalQueryFilterDto();
      signalFilter.dataVolumeMin = 123;
      signalFilter.dataVolumeMax = 456;

      // act
      const query = service.buildQuery(signalFilter);

      // assert
      expect(query.dataVolume).toEqual({ $gte: 123, $lte: 456 });
    });

    it('should not include the dataVolume field in the query if dataVolumeMin and dataVolumeMax are not provided', () => {
      // arrange
      const signalFilter = new SignalQueryFilterDto();
      signalFilter.dataVolumeMin = undefined;
      signalFilter.dataVolumeMax = undefined;

      // act
      const query = service.buildQuery(signalFilter);

      // assert
      expect(query.dataVolume).toBeUndefined();
    });

    it('should not include the $lte field in the query if dataVolumeMax is not provided', () => {
      // arrange
      const signalFilter = new SignalQueryFilterDto();
      signalFilter.dataVolumeMin = 123;

      // act
      const query = service.buildQuery(signalFilter);

      // assert
      expect(query.dataVolume['$lte']).toBeUndefined();
    });
  });
});
