export interface WeatherApiResponse {
  location?: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current?: WeatherData;
}

export interface WeatherData {
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  uv: number;
}
