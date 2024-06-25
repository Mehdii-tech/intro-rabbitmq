import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return { message: 'User created successfully', user };
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return { users };
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);
    return { user };
  }

  @Get(':id/notifications')
  async getUserNotifications(@Param('id') id: number) {
    const notifications = await this.usersService.getUserNotifications(id);
    return { notifications };
  }
}
