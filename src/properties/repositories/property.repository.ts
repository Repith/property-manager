import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from '../entities/property.entity';

@Injectable()
export class PropertyRepository {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<PropertyDocument>,
  ) {}

  async create(data: Partial<Property>): Promise<Property> {
    const created = new this.propertyModel(data);
    return created.save();
  }

  async findAll(
    filter: Partial<Property>,
    sort?: { createdAt?: 1 | -1 },
  ): Promise<Property[]> {
    return this.propertyModel.find(filter).sort(sort).exec();
  }

  async findOneById(id: string): Promise<Property | null> {
    return this.propertyModel.findById(id).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.propertyModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
