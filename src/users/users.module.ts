import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user';
import { Wish } from '../wishes/entity/wish';
import { HashService } from '../hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  providers: [UsersService, HashService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
