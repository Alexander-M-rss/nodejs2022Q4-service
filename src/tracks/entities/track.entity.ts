import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Track } from '../interfaces/track.interface';

@Entity('track')
export class TrackEntity implements Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;
}
