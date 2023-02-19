import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesRepsonse } from './interfaces/response.interface';
import { FavoritesEntityType } from './types/favorites-entity-type';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favotitesService: FavoritesService) {}

  @Get()
  async findAll(): Promise<FavoritesRepsonse> {
    return this.favotitesService.findAll();
  }

  @Post(':entityType/:id')
  async addArtist(
    @Param('entityType')
    entityType: FavoritesEntityType,
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<string> {
    return this.favotitesService.addEntity(entityType, id);
  }

  @Delete(':entityType/:id')
  @HttpCode(204)
  async removeArtist(
    @Param('entityType')
    entityType: FavoritesEntityType,
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<string> {
    return this.favotitesService.removeEntity(entityType, id);
  }
}
