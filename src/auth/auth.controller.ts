import {
  Controller,
  Get,
  Post,
  Body,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Serialize } from '@/interceptor/serialize.interceptor';
import { UserDto } from '@/users/dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from '@/users/user.entity';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterAuthDto, @Session() session: any) {
    const user = await this.authService.register(body);
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async login(@Body() body: LoginAuthDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/whoami')
  async whoAmI(@CurrentUser() users: User) {
    return users;
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
    return session;
  }
}
