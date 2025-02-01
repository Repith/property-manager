import { Injectable, Logger } from '@nestjs/common';
import { PropertyRepository } from '../repositories/property.repository';
import { CreatePropertyInput } from '../dto/create-property.input';
import { Property } from '../entities/property.entity';
import { WeatherService } from './weather.service';
import {
  PropertyFilterInput,
  PropertySortInput,
  SortOrderEnum,
} from '../dto/property-filter.input';

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name);

  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly weatherService: WeatherService,
  ) {}

  async findAll(
    filter?: PropertyFilterInput,
    sort?: PropertySortInput,
  ): Promise<Property[]> {
    this.logger.log(
      `Fetching properties with filter: ${JSON.stringify(filter)} and sort: ${JSON.stringify(sort)}`,
    );

    const dbFilter: Partial<PropertyFilterInput> = {};
    if (filter?.city) dbFilter.city = filter.city;
    if (filter?.state) dbFilter.state = filter.state;
    if (filter?.zipCode) dbFilter.zipCode = filter.zipCode;

    let dbSort: Record<string, 1 | -1> = {};
    if (sort?.sortByCreatedAt) {
      dbSort = {
        createdAt: sort.sortByCreatedAt === SortOrderEnum.ASC ? 1 : -1,
      };
    }

    try {
      const properties = await this.propertyRepository.findAll(
        dbFilter,
        dbSort,
      );
      this.logger.log(`Found ${properties.length} properties`);
      return properties;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error fetching properties: ${err.message}`, err.stack);
      throw err;
    }
  }

  async findOneById(id: string): Promise<Property | null> {
    this.logger.log(`Fetching property with id: ${id}`);
    try {
      const property = await this.propertyRepository.findOneById(id);
      if (property) {
        this.logger.log(`Property found: ${JSON.stringify(property)}`);
      } else {
        this.logger.warn(`Property with id ${id} not found`);
      }
      return property;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error fetching property with id ${id}: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  async create(input: CreatePropertyInput): Promise<Property> {
    this.logger.log(`Creating property with input: ${JSON.stringify(input)}`);
    try {
      const weatherResponse = await this.weatherService.getWeather(
        input.city,
        input.state,
        input.zipCode,
      );

      const lat = weatherResponse.location?.lat;
      const lon = weatherResponse.location?.lon;
      const currentWeather = weatherResponse.current;

      const newProperty: Partial<Property> = {
        city: input.city,
        street: input.street,
        state: input.state,
        zipCode: input.zipCode,
        lat,
        long: lon,
        weatherData: currentWeather,
      };

      const property = await this.propertyRepository.create(newProperty);
      this.logger.log(
        `Property created successfully: ${JSON.stringify(property)}`,
      );
      return property;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error creating property: ${err.message}`, err.stack);
      throw err;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    this.logger.log(`Deleting property with id: ${id}`);
    try {
      const result = await this.propertyRepository.delete(id);
      if (result) {
        this.logger.log(`Property with id ${id} deleted successfully`);
      } else {
        this.logger.warn(
          `Property with id ${id} not found or could not be deleted`,
        );
      }
      return result;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error deleting property with id ${id}: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }
}
