import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ default: 0 })
  point: number;
}
