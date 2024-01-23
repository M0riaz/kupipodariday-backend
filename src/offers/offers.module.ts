import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entity/offer';
import { User } from '../users/entity/user';
import { Wish } from '../wishes/entity/wish';
import { WishesModule } from '../wishes/wishes.module';
import { WishesService } from '../wishes/wishes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, User, Wish]), WishesModule],
  providers: [OffersService, WishesService],
  controllers: [OffersController],
})
export class OffersModule {}
