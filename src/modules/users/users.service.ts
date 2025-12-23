import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // Create new user
    async create(
        createUserDto: CreateUserDto,
    ): Promise<{ user: Omit<User, 'password'>; token: string }> {
        //check if user exists
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create user entity
        const user = this.userRepository.create({
            ...createUserDto,
            roles: createUserDto.roles || ['user'],
        });
        await this.userRepository.save(user);

        // Generate JWT token
        const token = this.generateToken(user);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    //Login user
    async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await user.validatePassword(loginDto.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        //check if user is active
        if (!user.isActive) {
            throw new Error('User account is inactive');
        }

        // Generate JWT token
        const token = this.generateToken(user);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    // Find all users
    async findAll(): Promise<Omit<User, 'password'>[]> {
        const users = await this.userRepository.find();
        return users.map(({ password, ...user }) => user);
    }

    // Generate JWT token
    private generateToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles,
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.secret'),
            expiresIn: this.configService.get<string>('jwt.expiresIn'),
        });
    }
}
