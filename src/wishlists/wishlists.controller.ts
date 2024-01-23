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
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../auth/guard/JwtGuard';
import { CreateWishlistDto } from './dto/CreateWishlist.dto';
import { UpdateWishlistDto } from './dto/UpdateWishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistService: WishlistsService) {}

  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return await this.wishlistService.create(req.user, createWishlistDto);
  }

  @Get()
  async findAll() {
    return await this.wishlistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishlistService.findOne(+id);
  }
  @Patch(':id')
  async updateOne(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return await this.wishlistService.updateOne(id, updateWishlistDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req) {
    return await this.wishlistService.remove(+id, req.user.id);
  }
}
