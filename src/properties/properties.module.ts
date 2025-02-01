import { Module } from '@nestjs/common';
import { Property, PropertySchema } from './entities/property.entity';
import { PropertyResolver } from './resolvers/property.resolver';
import { PropertyService } from './services/property.service';
import { WeatherService } from './services/weather.service';
import { PropertyRepository } from './repositories/property.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  providers: [
    PropertyResolver,
    PropertyService,
    PropertyRepository,
    WeatherService,
  ],
})
export class PropertiesModule {}
