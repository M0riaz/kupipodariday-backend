import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user';
import { Wish } from '../../wishes/entity/wish';
import { IsNumber } from 'class-validator';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // тот кто дарит подарок
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  // сам подарок(wish)
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
  //cумма доната
  @Column({ default: 0 })
  @IsNumber()
  amount: number;
  // анонимность отправителя
  @Column({ default: false })
  hidden: boolean;
}
