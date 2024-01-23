import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entity/wishlist';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user';
import { CreateWishlistDto } from './dto/CreateWishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { UpdateWishlistDto } from './dto/UpdateWishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(owner: User, createWishlistDto: CreateWishlistDto) {
    delete owner.password;
    delete owner.email;
    const wishes = await Promise.all(
      createWishlistDto.itemsId.map((itemId) =>
        this.wishesService.findOne(itemId),
      ),
    );
    if (!wishes) {
      throw new NotFoundException('что то пошло не так');
    }

    const wishlist = this.wishlistRepository.create({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner: owner,
      items: wishes,
    });

    return await this.wishlistRepository.save(wishlist);
  }
  async findAll() {
    return await this.wishlistRepository.find({
      relations: ['items', 'owner'],
    });
  }
  async findOne(id): Promise<Wishlist> {
    const wishList = await this.wishlistRepository.findOne({
      where: {
        id: id,
      },
      relations: ['items', 'owner'],
    });
    if (!wishList) {
      throw new NotFoundException('Такого списка нет');
    } else {
      return wishList;
    }
  }
  async updateOne(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Такого списка нет');
    } else {
      const wishes = await Promise.all(
        updateWishlistDto.itemsId.map((itemId) =>
          this.wishesService.findOne(itemId),
        ),
      );
      return await this.wishlistRepository.save({
        ...updateWishlistDto,
        owner: wishlist.owner,
        items: wishes,
      });
    }
  }
  async remove(id: number, userId) {
    const wishList = await this.wishlistRepository.findOne({
      where: {
        id: id,
      },
      relations: ['owner'],
    });
    if (!wishList) {
      throw new NotFoundException('такого списка нет');
    }
    if (userId !== wishList.owner.id) {
      throw new ForbiddenException('Нельзя удалять чужой список');
    }
    await this.wishlistRepository.delete(id);
    return wishList;
  }
}
