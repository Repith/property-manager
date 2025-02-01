// src/properties/services/property.service.ts
import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly weatherService: WeatherService,
  ) {}

  async findAll(
    filter?: PropertyFilterInput,
    sort?: PropertySortInput,
  ): Promise<Property[]> {
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

    return this.propertyRepository.findAll(dbFilter, dbSort);
  }

  async findOneById(id: string): Promise<Property | null> {
    return this.propertyRepository.findOneById(id);
  }

  async create(input: CreatePropertyInput): Promise<Property> {
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

    return this.propertyRepository.create(newProperty);
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.propertyRepository.delete(id);
  }
}
