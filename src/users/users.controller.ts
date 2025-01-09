import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

const userResponses = {
  create: { message: 'Usuario creado exitosamente', data: {} },
  getAll: { message: 'Usuarios obtenidos exitosamente', data: [] },
  getOne: { message: 'Usuario obtenido exitosamente', data: {} },
  update: { message: 'Usuario actualizado exitosamente', data: {} },
  delete: { message: 'Usuario eliminado exitosamente', data: {} }
};

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiCustomResponses({ summary: 'Crear un nuevo usuario', successExample: userResponses.create })
  @ApiBody({ schema: { ...userSchema, required: ['username', 'password'] } })
  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    const createdUser = await this.usersService.createUser(newUser);
    return ResponseUtil.success('Usuario creado exitosamente', createdUser);
  }

  @ApiCustomResponses({ summary: 'Obtener todos los usuarios', successExample: userResponses.getAll })
  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return ResponseUtil.success(users.length ? 'Usuarios obtenidos exitosamente' : 'No hay usuarios registrados', users);
  }

  @ApiCustomResponses({ summary: 'Obtener un usuario por su ID', successExample: userResponses.getOne })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUser(+id);
    return ResponseUtil.success(user ? 'Usuario obtenido exitosamente' : 'Usuario no encontrado', user);
  }

  @ApiCustomResponses({ summary: 'Actualizar un usuario por su ID', successExample: userResponses.update })
  @ApiBody({ schema: userSchema })
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUser(+id, updateUserDto);
    return ResponseUtil.success(updatedUser ? 'Usuario actualizado exitosamente' : 'Usuario no encontrado', updatedUser);
  }

  @ApiCustomResponses({ summary: 'Eliminar un usuario por su ID', successExample: userResponses.delete })
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.removeUser(+id);
    return ResponseUtil.success(deletedUser ? 'Usuario eliminado exitosamente' : 'Usuario no encontrado', deletedUser);
  }
}
