// src/properties/dto/property-filter.input.ts
import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class PropertyFilterInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  state?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  zipCode?: string;
}

@InputType()
export class PropertySortInput {
  @Field(() => SortOrderEnum, { nullable: true })
  sortByCreatedAt?: SortOrderEnum;
}

export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrderEnum, {
  name: 'SortOrderEnum',
});
