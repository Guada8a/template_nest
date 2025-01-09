import { Controller, Get, Post, Body, Patch, Param, Delete, Version, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiCustomResponses } from 'src/decorators/customResponses.decorator';
import { ResponseUtil } from 'src/utils/response.util';
import { ApiBody } from '@nestjs/swagger';

const userSchema = {
  type: 'object',
  properties: {
    username: { type: 'string', example: 'John Doe' },
    password: { type: 'string', example: '123456' }
  }
};

const profileSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', example: 'John' },
    lastName: { type: 'string', example: 'Doe' },
    age: { type: 'number', example: 25 }
  }
};

const userResponses = {
  create: { message: 'User created successfully', data: {} },
  getAll: { message: 'Users retrieved successfully', data: [] },
  getOne: { message: 'User retrieved successfully', data: {} },
  update: { message: 'User updated successfully', data: {} },
  delete: { message: 'User deleted successfully', data: {} }
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiCustomResponses({ summary: 'Create a new user', successExample: userResponses.create })
  @ApiBody({ schema: { ...userSchema, required: ['username', 'password'] } })
  @Version('1')
  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    const createdUser = await this.usersService.createUser(newUser);
    return ResponseUtil.success('User created successfully', createdUser);
  }

  @ApiCustomResponses({ summary: 'Get all users', successExample: userResponses.getAll })
  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return ResponseUtil.success(users.length ? 'Users retrieved successfully' : 'No users registered', users);
  }

  @ApiCustomResponses({ summary: 'Get user by ID', successExample: userResponses.getOne })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUser(+id);
    return ResponseUtil.success(user ? 'User retrieved successfully' : 'User not found', user);
  }

  @ApiCustomResponses({ summary: 'Update user by ID', successExample: userResponses.update })
  @ApiBody({ schema: userSchema })
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUser(+id, updateUserDto);
    return ResponseUtil.success(updatedUser ? 'User updated successfully' : 'User not found', updatedUser);
  }

  @ApiCustomResponses({ summary: 'Get user by username', successExample: userResponses.getOne })
  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.getUserByUsername(username);
    return ResponseUtil.success(user ? 'User retrieved successfully' : 'User not found', user);
  }

  @ApiCustomResponses({ summary: 'Delete user by ID', successExample: userResponses.delete })
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.removeUser(+id);
    return ResponseUtil.success(deletedUser ? 'User deleted successfully' : 'User not found', deletedUser);
  }

  @ApiCustomResponses({ summary: 'Create profile for user', successExample: userResponses.create })
  @ApiBody({ schema: { ...profileSchema, required: ['firstName', 'lastName', 'age'] } })
  @Post(':id/profile')
  async createProfile(@Param('id', ParseIntPipe) id: number, @Body() profile: CreateProfileDto) {
    const createdProfile = await this.usersService.createProfile(id, profile);
    return ResponseUtil.success('Profile created successfully', createdProfile);
  }

  @ApiCustomResponses({ summary: 'Get profile complete for user', successExample: userResponses.getOne })
  @Get(':id/profile')
  async getProfileComplete(@Param('id', ParseIntPipe) id: number) {
    const profile = await this.usersService.getProfileComplete(id);
    return ResponseUtil.success('Profile retrieved successfully', profile);
  }

  @ApiCustomResponses({ summary: 'Get posts for user', successExample: userResponses.getOne })
  @Get(':id/posts')
  async getPosts(@Param('id', ParseIntPipe) id: number) {
    const posts = await this.usersService.getPosts(id);
    return ResponseUtil.success('Posts retrieved successfully', posts);
  }
}
