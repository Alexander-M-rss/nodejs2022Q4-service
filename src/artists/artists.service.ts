import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly dbService: DbService) {}

  create(createArtistDto: CreateArtistDto) {
    return this.dbService.createArtist(createArtistDto);
  }

  findAll() {
    return this.dbService.getArtists();
  }

  findOne(id: string) {
    return this.dbService.getArtist(id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    return this.dbService.updateArtist(id, updateArtistDto);
  }

  remove(id: string) {
    return this.dbService.deleteArtist(id);
  }
}
