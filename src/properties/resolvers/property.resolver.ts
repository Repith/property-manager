import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Property } from '../entities/property.entity';
import { PropertyService } from '../services/property.service';
import { CreatePropertyInput } from '../dto/create-property.input';
import {
  PropertyFilterInput,
  PropertySortInput,
} from '../dto/property-filter.input';

@Resolver(() => Property)
export class PropertyResolver {
  constructor(private readonly propertyService: PropertyService) {}

  @Query(() => [Property], { name: 'properties' })
  async findAllProperties(
    @Args('filter', { nullable: true }) filter?: PropertyFilterInput,
    @Args('sort', { nullable: true }) sort?: PropertySortInput,
  ): Promise<Property[]> {
    return this.propertyService.findAll(filter, sort);
  }

  @Query(() => Property, { name: 'property' })
  async findPropertyById(@Args('id') id: string): Promise<Property | null> {
    return this.propertyService.findOneById(id);
  }

  @Mutation(() => Property)
  async createProperty(
    @Args('input') input: CreatePropertyInput,
  ): Promise<Property> {
    return this.propertyService.create(input);
  }

  @Mutation(() => Boolean)
  async deleteProperty(@Args('id') id: string): Promise<boolean> {
    return this.propertyService.deleteProperty(id);
  }
}
