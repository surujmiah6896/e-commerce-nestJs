import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

//   @Public()
//   @Post('refresh')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Refresh access token' })
//   @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
//   @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
//   async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
//     return this.authService.refreshTokens(refreshTokenDto.refreshToken);
//   }

//   @Post('logout')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Logout user (revoke refresh token)' })
//   @ApiResponse({ status: 200, description: 'Logged out successfully' })
//   @ApiResponse({ status: 401, description: 'Unauthorized' })
//   async logout(@Req() req: any) {
//     const userId = req.user.id;
//     await this.authService.logout(userId);
//     return { message: 'Logged out successfully' };
//   }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req: any) {
    return req.user;
  }
}
