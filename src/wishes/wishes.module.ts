import { Module } from '@nestjs/common';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entity/wish';
import { UsersService } from '../users/users.service';
import { User } from '../users/entity/user';
import { HashService } from '../hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User])],
  controllers: [WishesController],
  providers: [WishesService, UsersService, HashService],
  exports: [WishesService],
})
export class WishesModule {}
