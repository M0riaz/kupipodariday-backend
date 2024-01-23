import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entity/wish';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/CreateWish.Dto';
import { User } from '../users/entity/user';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    delete owner.password;
    delete owner.email;
    const wish = await this.wishRepository.create({
      ...createWishDto,
      owner: owner,
    });
    return await this.wishRepository.save(wish);
  }

  async findOne(id): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
      select: {
        owner: {
          id: true,
          username: true,
        },
      },
    });
    if (!wish) {
      throw new NotFoundException();
    }
    return wish;
  }
  async findLast(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: ['owner'],
      select: {
        owner: {
          id: true,
          username: true,
        },
      },
    });
  }
  async findTop(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'DESC' },
      relations: ['owner'],
      select: {
        owner: {
          id: true,
          username: true,
        },
      },
    });
  }

  async updateOne(
    id: number,
    createWishDto: CreateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findOne(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя менять чужое');
    } else {
      wish.name = createWishDto.name;
      wish.description = createWishDto.description;
      wish.link = createWishDto.link;
      wish.price = createWishDto.price;

      return await this.wishRepository.save(wish);
    }
  }

  async remove(id: number, userId): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя удалять чужой подарок');
    }
    await this.wishRepository.delete(id);
    return wish;
  }

  async copy(id: number, userId: number): Promise<Wish> {
    const wishToCopy = await this.findOne(id);
    if (userId === wishToCopy.owner.id) {
      throw new ForbiddenException('Нельзя копировать свой подарок');
    }
    const copiedWish = this.wishRepository.create({
      ...wishToCopy,
      id: undefined,
      owner: { id: userId, username: wishToCopy.owner.username },
      copied: 0,
      raised: 0,
    });
    await this.wishRepository.save(copiedWish);
    await this.wishRepository.update(id, { copied: wishToCopy.copied + 1 });
    return copiedWish;
  }
}
