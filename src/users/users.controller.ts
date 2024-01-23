import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard/JwtGuard';
import { UpdateUserDto } from './dto/UpdateUser.Dto';
import { FindUsersDto } from './dto/FindUsers.Dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  async getMe(@Req() req) {
    console.log(req.user.id);
    return await this.userService.findOne(req.user.id);
  }
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return await this.userService.findByUsername(username);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req) {
    return await this.userService.findUserWishes(req.user.id);
  }

  @Get(':username/wishes')
  async getUsernameWishes(@Param('username') username: string) {
    return await this.userService.findUsernameWishes(username);
  }
  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(updateUserDto, req.user.id);
  }
  @Post('find')
  async findMany(@Body() findUserDto: FindUsersDto) {
    return await this.userService.findMany(findUserDto);
  }
}
