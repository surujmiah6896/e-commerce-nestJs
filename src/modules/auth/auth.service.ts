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

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

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
}
