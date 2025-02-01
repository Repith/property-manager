import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherApiResponse } from '../interfaces/weather-api.interface';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private readonly configService: ConfigService) {}

  async getWeather(
    city: string,
    state: string,
    zipCode: string,
  ): Promise<WeatherApiResponse> {
    const apiKey = this.configService.get<string>('weatherapi.apiKey');
    const query = `${city},${state},${zipCode}`;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

    this.logger.log(`Fetching weather data for query: ${query}`);
    try {
      const response = await axios.get<WeatherApiResponse>(url);
      this.logger.log(`Weather data fetched successfully for ${query}`);
      return response.data;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error fetching weather data for ${query}: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }
}
