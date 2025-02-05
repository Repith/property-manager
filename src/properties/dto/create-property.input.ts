import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsPostalCode, Length } from 'class-validator';

@InputType()
export class CreatePropertyInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  street!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state!: string;

  @Field()
  @IsPostalCode('US')
  zipCode!: string;
}
