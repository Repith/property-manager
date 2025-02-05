import { Field, ObjectType } from '@nestjs/graphql';

export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: WeatherData;
}

@ObjectType()
export class WeatherCondition {
  @Field()
  text!: string;

  @Field()
  icon!: string;

  @Field()
  code!: number;
}

@ObjectType()
export class WeatherData {
  @Field()
  temp_c!: number;

  @Field()
  temp_f!: number;

  @Field()
  is_day!: number;

  @Field(() => WeatherCondition)
  condition!: WeatherCondition;

  @Field()
  wind_kph!: number;

  @Field()
  wind_dir!: string;

  @Field()
  humidity!: number;

  @Field()
  cloud!: number;

  @Field()
  feelslike_c!: number;

  @Field()
  uv!: number;
}
