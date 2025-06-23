import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LessonMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  url: string; // e.g. link to a file or video

  @Column()
  lessonId: number; // instead of ManyToOne relation to avoid coupling
}
