import { Exclude } from 'class-transformer';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { TrackEntity } from 'src/tracks/entities/track.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from '../interfaces/artist.interface';

@Entity('artist')
export class ArtistEntity implements Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => TrackEntity, (track) => track.artist, { cascade: true })
  @Exclude()
  tracks: TrackEntity[];

  @OneToMany(() => AlbumEntity, (album) => album.artist, { cascade: true })
  @Exclude()
  albums: AlbumEntity[];
}
