import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,CreateDateColumn } from "typeorm";
import { User } from "./userEntity";
import { Poll } from "./poll";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Poll)
  poll!: Poll;

  @Column()
  selectedOption!: string;

  @CreateDateColumn()
  votedAt!: Date;
}
