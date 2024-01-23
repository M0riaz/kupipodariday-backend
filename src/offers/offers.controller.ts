import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/CreateOffer.dto';
import { JwtGuard } from '../auth/guard/JwtGuard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private offerService: OffersService) {}

  @Get()
  async findAll() {
    return await this.offerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.offerService.findOne(+id);
  }

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return await this.offerService.createOffer(createOfferDto, req.user);
  }
}
