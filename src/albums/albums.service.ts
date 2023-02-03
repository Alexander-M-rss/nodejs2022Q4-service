import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly dbService: DbService) {}

  create(createAlbumDto: CreateAlbumDto) {
    return this.dbService.createAlbum(createAlbumDto);
  }

  findAll() {
    return this.dbService.getAlbums();
  }

  findOne(id: string) {
    return this.dbService.getAlbum(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return this.dbService.updateAlbum(id, updateAlbumDto);
  }

  remove(id: string) {
    return this.dbService.deleteAlbum(id);
  }
}
