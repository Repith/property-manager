/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';

import { PropertyService } from 'src/properties/services/property.service';
import { PropertyRepository } from 'src/properties/repositories/property.repository';
import { WeatherService } from 'src/properties/services/weather.service';
import {
  PropertyFilterInput,
  PropertySortInput,
  SortOrderEnum,
} from 'src/properties/dto/property-filter.input';
import { Property } from 'src/properties/entities/property.entity';
import { CreatePropertyInput } from 'src/properties/dto/create-property.input';

describe('PropertyService', () => {
  let service: PropertyService;
  let propertyRepository: PropertyRepository;
  let weatherService: WeatherService;

  const mockPropertyRepository = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockWeatherService = {
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PropertyRepository, useValue: mockPropertyRepository },
        { provide: WeatherService, useValue: mockWeatherService },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    propertyRepository = module.get<PropertyRepository>(PropertyRepository);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return properties list with filter and sort applied', async () => {
      const filter: PropertyFilterInput = {
        city: 'TestCity',
        state: 'TS',
        zipCode: '12345',
      };
      const sort: PropertySortInput = { sortByCreatedAt: SortOrderEnum.ASC };

      const expectedProperties: Property[] = [
        {
          _id: '1',
          city: 'TestCity',
          street: 'TestStreet',
          state: 'TS',
          zipCode: '12345',
          lat: 10,
          long: 20,
          weatherData: {},
          createdAt: new Date(),
        },
      ];

      mockPropertyRepository.findAll.mockResolvedValue(expectedProperties);

      const result = await service.findAll(filter, sort);
      expect(result).toEqual(expectedProperties);
      expect(mockPropertyRepository.findAll).toHaveBeenCalledWith(
        { city: 'TestCity', state: 'TS', zipCode: '12345' },
        { createdAt: 1 },
      );
    });

    it('should throw error when repository.findAll fails', async () => {
      const filter: PropertyFilterInput = {};
      const sort: PropertySortInput = {};
      const error = new Error('DB Error');

      mockPropertyRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll(filter, sort)).rejects.toThrow(error);
    });
  });

  describe('findOneById', () => {
    it('should return property if found', async () => {
      const property: Property = {
        _id: '1',
        city: 'TestCity',
        street: 'TestStreet',
        state: 'TS',
        zipCode: '12345',
        lat: 10,
        long: 20,
        weatherData: {},
        createdAt: new Date(),
      };

      mockPropertyRepository.findOneById.mockResolvedValue(property);

      const result = await service.findOneById('1');
      expect(result).toEqual(property);
      expect(mockPropertyRepository.findOneById).toHaveBeenCalledWith('1');
    });

    it('should return null and log warning if property not found', async () => {
      mockPropertyRepository.findOneById.mockResolvedValue(null);
      const result = await service.findOneById('non-existent');
      expect(result).toBeNull();
      expect(mockPropertyRepository.findOneById).toHaveBeenCalledWith(
        'non-existent',
      );
    });

    it('should throw error if repository.findOneById fails', async () => {
      const error = new Error('DB Error');
      mockPropertyRepository.findOneById.mockRejectedValue(error);
      await expect(service.findOneById('1')).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    it('should create a new property', async () => {
      const input: CreatePropertyInput = {
        city: 'TestCity',
        street: 'TestStreet',
        state: 'TS',
        zipCode: '12345',
      };

      const weatherResponse = {
        location: { lat: 10, lon: 20 },
        current: { temp: 25 },
      };

      const createdProperty: Property = {
        _id: '1',
        city: input.city,
        street: input.street,
        state: input.state,
        zipCode: input.zipCode,
        lat: 10,
        long: 20,
        weatherData: { temp: 25 },
        createdAt: new Date(),
      };

      mockWeatherService.getWeather.mockResolvedValue(weatherResponse);
      mockPropertyRepository.create.mockResolvedValue(createdProperty);

      const result = await service.create(input);
      expect(result).toEqual(createdProperty);
      expect(mockWeatherService.getWeather).toHaveBeenCalledWith(
        input.city,
        input.state,
        input.zipCode,
      );
      expect(mockPropertyRepository.create).toHaveBeenCalledWith({
        city: input.city,
        street: input.street,
        state: input.state,
        zipCode: input.zipCode,
        lat: 10,
        long: 20,
        weatherData: { temp: 25 },
      });
    });

    it('should throw error if creation fails', async () => {
      const input: CreatePropertyInput = {
        city: 'TestCity',
        street: 'TestStreet',
        state: 'TS',
        zipCode: '12345',
      };
      const error = new Error('Creation error');

      mockWeatherService.getWeather.mockRejectedValue(error);
      await expect(service.create(input)).rejects.toThrow(error);
    });
  });

  describe('deleteProperty', () => {
    it('should return true when property is deleted', async () => {
      mockPropertyRepository.delete.mockResolvedValue(true);

      const result = await service.deleteProperty('1');
      expect(result).toBe(true);
      expect(mockPropertyRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should return false when property is not found or not deleted', async () => {
      mockPropertyRepository.delete.mockResolvedValue(false);
      const result = await service.deleteProperty('non-existent');
      expect(result).toBe(false);
      expect(mockPropertyRepository.delete).toHaveBeenCalledWith(
        'non-existent',
      );
    });

    it('should throw error if deletion fails', async () => {
      const error = new Error('Deletion error');
      mockPropertyRepository.delete.mockRejectedValue(error);
      await expect(service.deleteProperty('1')).rejects.toThrow(error);
    });
  });
});
