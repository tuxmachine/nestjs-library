import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  userId: number;

  @Column()
  reference: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user?: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;
}
