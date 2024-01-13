import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, Length, MinLength, } from "class-validator";

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Nickname should be a string' })
  @MinLength(3, { message: 'Nickname should be at least 3 characters' })
  nickname?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Name should be a string' })
  @Length(3, 20, { message: 'Name should be between 3 and 20 characters' })
  name?: string
}