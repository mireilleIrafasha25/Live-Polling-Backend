import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../models/userEntity';

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    token!: string;

    @ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
    user!: User;

    @Column()
    expirationDate!: Date;

    @CreateDateColumn()
    createdAt!: Date;
}
