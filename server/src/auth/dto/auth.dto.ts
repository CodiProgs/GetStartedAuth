import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Length, MinLength, Validate } from "class-validator";
import { IsPasswordsMatching } from "common/common/decorators/passwords-matching";

@InputType()
export class RegisterDto {

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsNotEmpty()
  @Validate(IsPasswordsMatching)
  passwordConfirm: string;

}

@InputType()
export class LoginDto {

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}