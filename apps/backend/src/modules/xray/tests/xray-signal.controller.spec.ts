import { Test, TestingModule } from '@nestjs/testing';
import { XraySignalController } from '../xray-signal.controller';
import { SignalService } from '../signal.service';
import { SaveSignalDto } from '../dtos/save-signal.dto';
import { SignalQueryFilterDto } from '../dtos/signal-query-filter.dto';
import { PaginationDto } from '../dtos/pagination.dto';
import { NotFoundException } from '@nestjs/common';

describe('XraySignalController', () => {
  let controller: XraySignalController;
  let signalService: jest.Mocked<SignalService>;

  beforeEach(async () => {
    const mockSignalService = {
      saveSignal: jest.fn(),
      findAll: jest.fn(),
      deleteAll: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [XraySignalController],
      providers: [
        {
          provide: SignalService,
          useValue: mockSignalService,
        },
      ],
    }).compile();

    controller = module.get<XraySignalController>(XraySignalController);
    signalService = module.get<jest.Mocked<SignalService>>(SignalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new signal successfully', async () => {
      // arrange
      const saveSignalDto: SaveSignalDto = {
        deviceId: '123',
        time: 123,
        data: [
          [1, [1, 2, 3]],
          [2, [4, 5, 6]],
        ],
      };

      const mockSignal = {
        deviceId: '123',
        time: 123,
        dataLength: 2,
        dataVolume: 25,
        rawData: [
          [1, [1, 2, 3]],
          [2, [4, 5, 6]],
        ],
        _id: 'mock-id',
        __v: 0,
      } as any;

      signalService.saveSignal.mockResolvedValue(mockSignal);

      // act
      const result = await controller.create(saveSignalDto);

      // assert
      expect(signalService.saveSignal).toHaveBeenCalledWith(saveSignalDto);
      expect(result).toEqual({
        status: 'success',
        message: 'Signal saved successfully',
      });
    });
  });

  describe('findAll', () => {
    it('should return all signals successfully', async () => {
      // arrange
      const signalQueryFilter = new SignalQueryFilterDto();
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
          _id: 'mock-id',
          __v: 0,
        } as any,
      ];
      const serviceResponse = {
        signals,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      signalService.findAll.mockResolvedValue(serviceResponse);

      // act
      const result = await controller.findAll(signalQueryFilter, pagination);

      // assert
      expect(signalService.findAll).toHaveBeenCalledWith(
        signalQueryFilter,
        pagination,
      );
      expect(result).toEqual({
        status: 'success',
        data: serviceResponse,
        message: 'Signals fetched successfully',
      });
    });

    it('should throw NotFoundException when no signals found', async () => {
      // arrange
      const signalQueryFilter = new SignalQueryFilterDto();
      const pagination = new PaginationDto();
      const serviceResponse = {
        signals: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      signalService.findAll.mockResolvedValue(serviceResponse);

      // act & assert
      await expect(
        controller.findAll(signalQueryFilter, pagination),
      ).rejects.toThrow(NotFoundException);
      expect(signalService.findAll).toHaveBeenCalledWith(
        signalQueryFilter,
        pagination,
      );
    });
  });

  describe('deleteAll', () => {
    it('should delete all signals successfully', async () => {
      // arrange
      const signalQueryFilter = new SignalQueryFilterDto();
      const serviceResponse = {
        acknowledged: true,
        deletedCount: 5,
      } as any;

      signalService.deleteAll.mockResolvedValue(serviceResponse);

      // act
      const result = await controller.deleteAll(signalQueryFilter);

      // assert
      expect(signalService.deleteAll).toHaveBeenCalledWith(signalQueryFilter);
      expect(result).toEqual({
        status: 'success',
        message: '5 signals deleted successfully',
      });
    });

    it('should throw NotFoundException when no signals found to delete', async () => {
      // arrange
      const signalQueryFilter = new SignalQueryFilterDto();
      const serviceResponse = {
        acknowledged: true,
        deletedCount: 0,
      } as any;

      signalService.deleteAll.mockResolvedValue(serviceResponse);

      // act & assert
      await expect(controller.deleteAll(signalQueryFilter)).rejects.toThrow(
        NotFoundException,
      );
      expect(signalService.deleteAll).toHaveBeenCalledWith(signalQueryFilter);
    });
  });

  describe('findOne', () => {
    it('should return a signal by id successfully', async () => {
      // arrange
      const signalId = '123';
      const signal = {
        deviceId: '123',
        time: 123,
        dataLength: 2,
        dataVolume: 25,
        rawData: [
          [1, [1, 2, 3]],
          [2, [4, 5, 6]],
        ],
        _id: 'mock-id',
        __v: 0,
      } as any;

      signalService.findOne.mockResolvedValue(signal);

      // act
      const result = await controller.findOne(signalId);

      // assert
      expect(signalService.findOne).toHaveBeenCalledWith(signalId);
      expect(result).toEqual({
        status: 'success',
        data: signal,
        message: 'Signal fetched successfully',
      });
    });

    it('should throw NotFoundException when signal not found', async () => {
      // arrange
      const signalId = '123';

      signalService.findOne.mockResolvedValue(null);

      // act & assert
      await expect(controller.findOne(signalId)).rejects.toThrow(
        NotFoundException,
      );
      expect(signalService.findOne).toHaveBeenCalledWith(signalId);
    });
  });

  describe('deleteOne', () => {
    it('should delete a signal by id successfully', async () => {
      // arrange
      const signalId = '123';
      const signal = {
        deviceId: '123',
        time: 123,
        dataLength: 2,
        dataVolume: 25,
        rawData: [
          [1, [1, 2, 3]],
          [2, [4, 5, 6]],
        ],
        _id: 'mock-id',
        __v: 0,
      } as any;

      signalService.deleteOne.mockResolvedValue(signal);

      // act
      const result = await controller.deleteOne(signalId);

      // assert
      expect(signalService.deleteOne).toHaveBeenCalledWith(signalId);
      expect(result).toEqual({
        status: 'success',
        message: 'Signal deleted successfully',
      });
    });

    it('should throw NotFoundException when signal not found for deletion', async () => {
      // arrange
      const signalId = '123';

      signalService.deleteOne.mockResolvedValue(null);

      // act & assert
      await expect(controller.deleteOne(signalId)).rejects.toThrow(
        NotFoundException,
      );
      expect(signalService.deleteOne).toHaveBeenCalledWith(signalId);
    });
  });
});
