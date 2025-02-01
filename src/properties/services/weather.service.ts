import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherApiResponse } from '../interfaces/weather-api.interface';

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}

  async getWeather(
    city: string,
    state: string,
    zipCode: string,
  ): Promise<WeatherApiResponse> {
    const apiKey = this.configService.get<string>('weatherapi.apiKey');
    const query = `${city},${state},${zipCode}`;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

    const response = await axios.get<WeatherApiResponse>(url);
    return response.data;
  }
}
