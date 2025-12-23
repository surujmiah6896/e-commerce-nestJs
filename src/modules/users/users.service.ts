import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
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

  // Find user by ID
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Find user by email (for auth)
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Update user
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being changed and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  //Delete user (soft delete)
  async remove(id: string): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    if(result.affected == 0){
        throw new NotFoundException(`User with ID ${id} not found`);
    }
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

  // Validate Jwt token
  async validateToken(token: string): Promise<any>{
    try {
        return this.jwtService.verify(token,{
            secret: this.configService.get<string>('jwt.secret'),
        });
    } catch (error) {
        throw new UnauthorizedException('Invalid token');
    }
  }
}
