import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { Repository } from 'typeorm';
import {
  FavsAlbumEntity,
  FavsArtistEntity,
  FavsTrackEntity,
} from './entities/favorites.entity';
import { FavoritesRepsonse } from './interfaces/response.interface';
import {
  FavoritesEntityType,
  FavoritesEntityTypeValues,
} from './types/favorites-entity-type';

type FavsEntity = FavsArtistEntity | FavsAlbumEntity | FavsTrackEntity;

type EntityService = ArtistsService | AlbumsService | TracksService;

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavsArtistEntity)
    private readonly artistRepository: Repository<FavsArtistEntity>,
    @InjectRepository(FavsAlbumEntity)
    private readonly albumRepository: Repository<FavsAlbumEntity>,
    @InjectRepository(FavsTrackEntity)
    private readonly trackRepository: Repository<FavsTrackEntity>,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  private checkEntityType(entityType: FavoritesEntityType): void {
    if (!FavoritesEntityTypeValues.includes(entityType)) {
      throw new NotFoundException('Resource not found');
    }
  }

  async findAll(): Promise<FavoritesRepsonse> {
    const favsArtists = await this.artistRepository.find({
      relations: ['artist'],
    });
    const favsAlbums = await this.albumRepository.find({
      relations: ['album'],
    });
    const favsTracks = await this.trackRepository.find({
      relations: ['track'],
    });

    const response: FavoritesRepsonse = {
      artists: favsArtists.map((favsArtist) => {
        return {
          ...favsArtist.artist,
        };
      }),
      albums: favsAlbums.map((favsAlbum) => {
        return {
          ...favsAlbum.album,
        };
      }),
      tracks: favsTracks.map((favsTrack) => {
        return {
          ...favsTrack.track,
        };
      }),
    };

    return response;
  }

  async addEntity(
    entityType: FavoritesEntityType,
    id: string,
  ): Promise<string> {
    this.checkEntityType(entityType);

    const service: EntityService = this[`${entityType}sService`];

    try {
      await service.findOne(id);
    } catch (_) {
      throw new UnprocessableEntityException(
        `${entityType} with such id doesn't exist`,
      );
    }

    const repository: Repository<FavsEntity> = this[`${entityType}Repository`];
    const favsEntity = repository.create();

    favsEntity.id = id;
    await repository.save(favsEntity);

    return `${entityType} has been added to favorites`;
  }

  async removeEntity(entityType: FavoritesEntityType, id: string) {
    this.checkEntityType(entityType);

    const repository: Repository<FavsEntity> = this[`${entityType}Repository`];
    const result = await repository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`${entityType} is not favorite`);
    }

    return `${entityType} has been removed from favorites`;
  }
}
