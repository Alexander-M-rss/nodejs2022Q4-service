import { Exclude } from 'class-transformer';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { TrackEntity } from 'src/tracks/entities/track.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('favsArtist')
export class FavsArtistEntity {
  @Column({ name: 'artistId', type: 'uuid', primary: true, unique: true })
  @Exclude()
  id: string;

  @OneToOne(() => ArtistEntity, (artist) => artist.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity;
}

@Entity('favsAlbum')
export class FavsAlbumEntity {
  @Column({ name: 'albumId', type: 'uuid', primary: true, unique: true })
  @Exclude()
  id: string;

  @OneToOne(() => AlbumEntity, (album) => album.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: AlbumEntity;
}

@Entity('favsTrack')
export class FavsTrackEntity {
  @Column({ name: 'trackId', type: 'uuid', primary: true, unique: true })
  @Exclude()
  id: string;

  @OneToOne(() => TrackEntity, (track) => track.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: TrackEntity;
}
