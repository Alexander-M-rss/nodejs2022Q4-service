import { Exclude } from 'class-transformer';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { FavsAlbumEntity } from 'src/favorites/entities/favorites.entity';
import { TrackEntity } from 'src/tracks/entities/track.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from '../interfaces/album.interface';

@Entity('album')
export class AlbumEntity implements Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ name: 'artistId', nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Exclude()
  artist: ArtistEntity;

  @OneToMany(() => TrackEntity, (track) => track.artist, { cascade: true })
  @Exclude()
  tracks: TrackEntity[];

  @OneToOne(() => FavsAlbumEntity, (favsAlbum) => favsAlbum.id, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  favsAlbum: FavsAlbumEntity;
}
