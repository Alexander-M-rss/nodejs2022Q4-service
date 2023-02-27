import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    const newArtist = this.artistRepository.create(createArtistDto);

    return this.artistRepository.save(newArtist);
  }

  async findAll(): Promise<ArtistEntity[]> {
    return this.artistRepository.find();
  }

  async findOne(id: string): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException("Artist Id doesn't exist");
    }

    return artist;
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    const artist = await this.findOne(id);

    Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException("Artist Id doesn't exist");
    }
  }
}
