import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordTransformer } from './password.transformer';

@Entity({
  name: 'upload',
})
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  imageData: string;

  @Column({ type: 'text' })
  jsonResult: string;
}
