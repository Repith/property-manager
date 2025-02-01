/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePropertyInput } from 'src/properties/dto/create-property.input';
import {
  PropertyFilterInput,
  PropertySortInput,
  SortOrderEnum,
} from 'src/properties/dto/property-filter.input';
import { Property } from 'src/properties/entities/property.entity';
import { PropertyResolver } from 'src/properties/resolvers/property.resolver';
import { PropertyService } from 'src/properties/services/property.service';

describe('PropertyResolver', () => {
  let resolver: PropertyResolver;
  let propertyService: PropertyService;

  const mockPropertyService = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    create: jest.fn(),
    deleteProperty: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyResolver,
        { provide: PropertyService, useValue: mockPropertyService },
      ],
    }).compile();

    resolver = module.get<PropertyResolver>(PropertyResolver);
    propertyService = module.get<PropertyService>(PropertyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllProperties', () => {
    it('should return list of properties', async () => {
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

      mockPropertyService.findAll.mockResolvedValue(expectedProperties);
      const result = await resolver.findAllProperties(filter, sort);
      expect(result).toEqual(expectedProperties);
      expect(mockPropertyService.findAll).toHaveBeenCalledWith(filter, sort);
    });
  });

  describe('findPropertyById', () => {
    it('should return a property by id', async () => {
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
      mockPropertyService.findOneById.mockResolvedValue(property);
      const result = await resolver.findPropertyById('1');
      expect(result).toEqual(property);
      expect(mockPropertyService.findOneById).toHaveBeenCalledWith('1');
    });
  });

  describe('createProperty', () => {
    it('should create and return a new property', async () => {
      const input: CreatePropertyInput = {
        city: 'TestCity',
        street: 'TestStreet',
        state: 'TS',
        zipCode: '12345',
      };
      const createdProperty: Property = {
        _id: '1',
        city: input.city,
        street: input.street,
        state: input.state,
        zipCode: input.zipCode,
        lat: 10,
        long: 20,
        weatherData: {},
        createdAt: new Date(),
      };
      mockPropertyService.create.mockResolvedValue(createdProperty);
      const result = await resolver.createProperty(input);
      expect(result).toEqual(createdProperty);
      expect(mockPropertyService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('deleteProperty', () => {
    it('should return true when deletion is successful', async () => {
      mockPropertyService.deleteProperty.mockResolvedValue(true);
      const result = await resolver.deleteProperty('1');
      expect(result).toBe(true);
      expect(mockPropertyService.deleteProperty).toHaveBeenCalledWith('1');
    });
  });
});
