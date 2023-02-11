import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    const newAlbum = this.albumRepository.create(createAlbumDto);

    return this.albumRepository.save(newAlbum);
  }

  async findAll(): Promise<AlbumEntity[]> {
    return this.albumRepository.find();
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException("Album Id doesn't exist");
    }

    return album;
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    const album = await this.findOne(id);

    Object.assign(album, updateAlbumDto);
    return this.albumRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException("Album Id doesn't exist");
    }
  }
}
