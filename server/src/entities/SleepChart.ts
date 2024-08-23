import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { IsNumber, IsString, MaxLength } from "class-validator";

@Entity()
export class SleepChart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  @MaxLength(50)
  name: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  @MaxLength(50)
  gender: string;

  @Column('int')
  @IsNumber()
  count: number;

}
