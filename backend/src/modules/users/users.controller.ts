import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() { return this.usersService.findAllUsers(); }

  @Post()
  createUser(@Body() body: any) { return this.usersService.createUser(body); }

  @Delete(':id')
  deleteUser(@Param('id') id: string) { return this.usersService.deleteUser(+id); }

  @Get('permissions')
  getPermissions() { return this.usersService.getAllPermissions(); }

  @Post('permissions')
  savePermissions(@Body() body: any) { return this.usersService.savePermissions(body); }

  @Post('seed')
  seed() { return this.usersService.seedDefaultPermissions(); }
}