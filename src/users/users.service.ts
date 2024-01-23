import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.Dto';
import { Wish } from '../wishes/entity/wish';
import { HashService } from '../hash/hash.service';
import { UpdateUserDto } from './dto/UpdateUser.Dto';
import { FindUsersDto } from './dto/FindUsers.Dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email } = createUserDto;

    const existingUsernameUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUsernameUser) {
      throw new BadRequestException(
        'Пользователь с таким именем пользователя уже существует',
      );
    }

    const existingEmailUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingEmailUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = await this.hashService.hash(
      createUserDto.password.toString(),
    );

    return await this.usersRepository.save(user);
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }

  //test
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      select: [
        'id',
        'createdAt',
        'updatedAt',
        'username',
        'about',
        'avatar',
        'email',
        'password',
      ],
    });
    if (!user) {
      throw new NotFoundException('такого пользователя нет');
    }
    return user;
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });

    return wishes.map((wish) => {
      const { owner, ...rest } = wish;
      const sanitizedOwner = { ...owner, password: undefined };
      return { ...rest, owner: sanitizedOwner };
    });
  }

  async findUsernameWishes(name: string): Promise<Wish[]> {
    await this.findByUsername(name);
    const wishes = await this.wishesRepository.find({
      where: { owner: { username: name } },
      relations: ['owner'],
    });

    if (!wishes || wishes.length === 0) {
      throw new NotFoundException('У пользователя нет подарков');
    }

    return wishes.map((wish) => {
      const { owner, ...rest } = wish;
      const sanitizedOwner = { ...owner, password: undefined };
      return { ...rest, owner: sanitizedOwner };
    });
  }
  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<User> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    user.username = updateUserDto.username;
    user.about = updateUserDto.about;
    user.avatar = updateUserDto.avatar;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;

    await this.usersRepository.save(user);

    return user;
  }
  async findMany(query: FindUsersDto): Promise<User[]> {
    const user = await this.usersRepository.find({
      where: [
        {
          email: query.query,
        },
        {
          username: query.query,
        },
      ],
      select: [
        'id',
        'username',
        'about',
        'avatar',
        'email',
        'createdAt',
        'updatedAt',
      ],
    });
    console.log(user);
    return user;
  }
  // async findMany(query: FindUsersDto): Promise<User[]> {
  //   const find = await this.usersRepository.createQueryBuilder('user');
  //   const findObj = await find.where('user.username LIKE :name', {
  //     name: `%${query.query}%`,
  //   });
  //   findObj.orWhere('user.email LIKE :qwe', {
  //     qwe: `%${query.query}%`,
  //   });
  //   const users = await findObj.getMany();
  //   console.log(find);
  //   return users;
  // }
}
