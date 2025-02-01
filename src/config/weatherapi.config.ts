import { registerAs } from '@nestjs/config';

export default registerAs('weatherapi', () => ({
  apiKey: process.env.WEATHERAPI_API_KEY || '',
}));
