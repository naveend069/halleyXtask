// halleyx-backend/src/auth/dto/login-auth.dto.ts
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
