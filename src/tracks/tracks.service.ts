import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    const newTrack = this.trackRepository.create(createTrackDto);

    return this.trackRepository.save(newTrack);
  }

  async findAll(): Promise<TrackEntity[]> {
    return this.trackRepository.find();
  }

  async findOne(id: string): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException("Track Id doesn't exist");
    }

    return track;
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    const track = await this.findOne(id);

    Object.assign(track, updateTrackDto);
    return this.trackRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException("Track Id doesn't exist");
    }
  }
}
