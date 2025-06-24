
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Unique,OneToMany,OneToOne
} from 'typeorm';
import { Token } from './Token'
import { Poll } from './poll';
import { UserInfo } from 'os';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}
 

@Entity()
@Unique(['email']) 
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
  type: 'enum',
  enum: UserRole,
  default: UserRole.USER,
})
role!: UserRole;


  @Column()
  otp!: number;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires!: Date;

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

 @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens!: Token[];
  @OneToMany(() => Poll, (poll) => poll.createdBy, { cascade: true })
  polls!: Poll[];
}
