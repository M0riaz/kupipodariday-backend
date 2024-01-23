import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/CreateWish.Dto';
import { JwtGuard } from '../auth/guard/JwtGuard';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('last')
  async findLast() {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.findTop();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(req.user, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: number) {
    return await this.wishesService.copy(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: CreateWishDto,
  ) {
    return await this.wishesService.updateOne(+id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return await this.wishesService.remove(id, req.user.id);
  }
}
