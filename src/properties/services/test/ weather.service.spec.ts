/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherService } from 'src/properties/services/weather.service';
import { WeatherApiResponse } from 'src/properties/interfaces/weather-api.interface';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  let service: WeatherService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch weather data successfully', async () => {
    const fakeResponse: WeatherApiResponse = {
      location: {
        lat: 10,
        lon: 20,
        name: 'Test City',
        region: 'Testing',
        country: 'USA',
        localtime: '12345',
      },
      current: {
        temp_c: 18.9,
        temp_f: 66,
        is_day: 1,
        condition: {
          text: 'Partly cloudy',
          icon: 'icon.png',
          code: 1003,
        },
        wind_kph: 3.6,
        wind_dir: 'ENE',
        humidity: 25,
        cloud: 75,
        feelslike_c: 18.9,
        uv: 3.1,
      },
    };

    mockedAxios.get.mockResolvedValue({ data: fakeResponse });

    const result = await service.getWeather('TestCity', 'TS', '12345');
    expect(result).toEqual(fakeResponse);
    expect(configService.get).toHaveBeenCalledWith('weatherapi.apiKey');
  });

  it('should throw error if axios call fails', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValue(error);

    await expect(service.getWeather('TestCity', 'TS', '12345')).rejects.toThrow(
      'Network error',
    );
  });
});
