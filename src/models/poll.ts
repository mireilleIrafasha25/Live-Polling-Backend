// models/poll.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './userEntity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

 @Column({ type: 'jsonb' })
  options!: { name: string, voteCount: number }[];

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp' })
  endTime!: Date;

  @Column({ default: false })
  isAnonymous!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => User, user => user.polls, {
    onDelete: "SET NULL",
    eager: true }) // eager=true optional
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User;
}
