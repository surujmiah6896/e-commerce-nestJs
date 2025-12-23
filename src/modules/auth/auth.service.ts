import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginResponseDto, RegisterResponseDto } from '../users/dto/login-response.dto';
import { toUserResponseDto } from '../users/dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../users/dto/login.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Create new user
  async create(createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      roles: createUserDto.roles || ['user'],
    });
    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return {
      user: toUserResponseDto(user),
      token,
    };
  }

  //Login user
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await this.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const token = this.generateToken(user);

    return {
      user: toUserResponseDto(user),
      token,
    };
  }

//   async refreshTokens(refreshToken: string): Promise<RefreshTokenResponseDto> {
//     try {
//       // Verify refresh token
//       const payload = this.jwtService.verify(refreshToken, {
//         secret: this.configService.get<string>('config.jwt.refreshSecret'),
//       });

//       // Check if refresh token exists in storage
//       const storedToken = await this.getRefreshToken(payload.sub);

//       if (!storedToken || storedToken !== refreshToken) {
//         throw new UnauthorizedException('Invalid refresh token');
//       }

//       // Get user
//       const user = await this.userRepository.findById(payload.sub);

//       if (!user) {
//         throw new UnauthorizedException('User not found');
//       }

//       // Generate new tokens
//       const tokens = await this.generateTokens(user);

//       // Update stored refresh token
//       await this.updateRefreshToken(user.id, tokens.refreshToken);

//       return tokens;
//     } catch (error) {
//       throw new UnauthorizedException('Invalid or expired refresh token');
//     }
//   }

//   async logout(userId: string): Promise<void> {
//     // Remove refresh token from storage
//     await this.deleteRefreshToken(userId);
//   }

  private async generateTokens(user: any): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      // Access token (short-lived)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('config.jwt.secret'),
        expiresIn: this.configService.get<string>(
          'config.jwt.expiresIn',
          '15m',
        ),
      }),

      // Refresh token (long-lived)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('config.jwt.refreshSecret'),
        expiresIn: this.configService.get<string>(
          'config.jwt.refreshExpiresIn',
          '7d',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Generate JWT token
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('config.jwt.secret'),
      expiresIn: this.configService.get<string>('config.jwt.expiresIn'),
    });
  }

  // Helper method to validate password
  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Validate Jwt token
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('config.jwt.secret'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

//   private async deleteRefreshToken(
//     userId: string,
//     refreshToken?: string,
//   ): Promise<void> {
//     if (refreshToken) {
//       // Delete specific token
//       this.refreshTokenStore.delete(refreshToken);
//       this.userTokensStore.get(userId)?.delete(refreshToken);
//     } else {
//       // Delete all user tokens
//       const tokens = this.userTokensStore.get(userId);
//       if (tokens) {
//         tokens.forEach((token) => {
//           this.refreshTokenStore.delete(token);
//         });
//         this.userTokensStore.delete(userId);
//       }
//     }
//   }

//   private async getRefreshToken(refreshToken: string): Promise<{
//     userId: string;
//     expiresAt: Date;
//     ipAddress?: string;
//     userAgent?: string;
//   } | null> {
//     const data = this.refreshTokenStore.get(refreshToken);

//     if (!data || data.expiresAt < new Date()) {
//       this.refreshTokenStore.delete(refreshToken);
//       return null;
//     }

//     return data;
//   }

//   private cleanupExpiredTokens(): void {
//     const now = new Date();

//     for (const [token, data] of this.refreshTokenStore.entries()) {
//       if (data.expiresAt < now) {
//         this.refreshTokenStore.delete(token);

//         // Remove from user's token set
//         const userTokens = this.userTokensStore.get(data.userId);
//         if (userTokens) {
//           userTokens.delete(token);
//           if (userTokens.size === 0) {
//             this.userTokensStore.delete(data.userId);
//           }
//         }
//       }
//     }
//   }
}
