import { connect, model, Schema } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import {
  WeatherApiResponse,
  WeatherData,
} from 'src/properties/interfaces/weather-api.interface';

// Definicja schematu Mongoose
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
    throw new Error(`Błąd podczas parsowania JSON z pliku: ${filePath}`);
  }
}

async function fetchWeather(
  city: string,
  state: string,
): Promise<WeatherData | undefined> {
  const apiKey = process.env.WEATHERAPI_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
    `${city},${state}`,
  )}`;
  const response = await axios.get<WeatherApiResponse>(url);
  return response.data.current;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI || '';
  await connect(mongoUri);
  console.log('Połączono z bazą danych.');

  const seedFilePath = path.join(__dirname, '../seed-data.json');
  const seedData: PropertyType[] = parseJSON<PropertyType[]>(seedFilePath);

  const toInsert: PropertyType[] = [];

  for (const property of seedData) {
    const weatherData = await fetchWeather(property.city, property.state);
    toInsert.push({ ...property, weatherData });
  }

  await Property.insertMany(toInsert);
  console.log(`Dodano ${seedData.length} rekordów.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
