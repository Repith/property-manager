import { connect, model, Schema } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { WeatherApiResponse } from 'src/properties/interfaces/weather-api.interface';

const PropertySchema = new Schema(
  {
    city: { type: String, required: true },
    street: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    lat: { type: Number },
    long: { type: Number },
    weatherData: { type: Object },
  },
  { timestamps: true },
);

const Property = model('Property', PropertySchema);

interface PropertyType {
  city: string;
  street: string;
  state: string;
  zipCode: string;
  lat?: number;
  long?: number;
  weatherData?: any;
}

function parseJSON<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(content) as T;
  } catch {
    throw new Error(`Error parsin JSON from file: ${filePath}`);
  }
}

async function fetchWeather(
  city: string,
  state: string,
): Promise<WeatherApiResponse | undefined> {
  const apiKey = process.env.WEATHERAPI_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
    `${city},${state}`,
  )}`;
  const response = await axios.get<WeatherApiResponse>(url);
  return response.data;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI || '';
  await connect(mongoUri);
  console.log('Connected to MongoDB.');

  const seedFilePath = path.join(__dirname, '../seed-data.json');
  const seedData: PropertyType[] = parseJSON<PropertyType[]>(seedFilePath);

  const toInsert: PropertyType[] = [];

  for (const property of seedData) {
    const data = await fetchWeather(property.city, property.state);
    toInsert.push({
      ...property,
      lat: data?.location?.lat,
      long: data?.location?.lon,
      weatherData: data?.current,
    });
  }

  await Property.insertMany(toInsert);
  console.log(`Added ${seedData.length} properties.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
