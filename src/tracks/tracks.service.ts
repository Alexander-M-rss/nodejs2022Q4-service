import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly dbService: DbService) {}

  create(createTrackDto: CreateTrackDto) {
    return this.dbService.createTrack(createTrackDto);
  }

  findAll() {
    return this.dbService.getTracks();
  }

  findOne(id: string) {
    return this.dbService.getTrack(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    return this.dbService.updateTrack(id, updateTrackDto);
  }

  remove(id: string) {
    return this.dbService.deleteTrack(id);
  }
}
