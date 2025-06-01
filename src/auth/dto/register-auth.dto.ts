import { IsEmail, IsString } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
