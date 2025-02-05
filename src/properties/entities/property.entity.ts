import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WeatherData } from '../interfaces/weather-api.interface';

export type PropertyDocument = HydratedDocument<Property>;

@ObjectType()
@Schema({ timestamps: true })
export class Property {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ required: true })
  city!: string;

  @Field()
  @Prop({ required: true })
  street!: string;

  @Field()
  @Prop({ required: true })
  state!: string;

  @Field()
  @Prop({ required: true })
  zipCode!: string;

  @Field({ nullable: true })
  @Prop()
  lat?: number;

  @Field({ nullable: true })
  @Prop()
  long?: number;

  @Field({
    nullable: true,
    description: 'Weather data stored as JSON',
  })
  @Prop({ type: Object })
  weatherData!: WeatherData;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
