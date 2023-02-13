import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FavsAlbumEntity,
  FavsArtistEntity,
  FavsTrackEntity,
} from './entities/favorites.entity';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavsArtistEntity,
      FavsAlbumEntity,
      FavsTrackEntity,
    ]),
    ArtistsModule,
    AlbumsModule,
    TracksModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
