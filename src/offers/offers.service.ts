import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entity/offer';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/CreateOffer.dto';
import { Wish } from '../wishes/entity/wish';
import { User } from '../users/entity/user';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private wishService: WishesService,
  ) {}
  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find({ relations: ['user', 'item'] });
  }
  async findOne(id): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'item'],
    });
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }

  async createOffer(
    createOfferDto: CreateOfferDto,
    user: User,
  ): Promise<Offer> {
    const { itemId } = createOfferDto;
    const wishItem = await this.wishService.findOne(itemId);
    if (wishItem === undefined || !wishItem) {
      throw new NotFoundException('такого подарка нет');
    }
    if (wishItem.owner.id === user.id) {
      throw new BadRequestException('Нельзя донатить себе');
    }
    if (wishItem.raised >= wishItem.price) {
      throw new BadRequestException('Достаточная сумма собрана');
    }
    const newRaisedAmount = wishItem.raised + createOfferDto.amount;
    if (newRaisedAmount > wishItem.price) {
      throw new BadRequestException(
        'Сумма доната не должна превышать цену подарка',
      );
    }
    wishItem.raised = newRaisedAmount;
    await this.wishRepository.save(wishItem);
    const offer = new Offer();
    offer.amount = createOfferDto.amount;
    offer.hidden = createOfferDto.hidden;
    offer.item = wishItem;
    offer.user = user;
    delete user.password;
    return await this.offersRepository.save(offer);
  }
}
