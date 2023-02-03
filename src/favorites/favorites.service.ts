import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  FavoritesEntityType,
  FavoritesEntityTypeValues,
} from './types/favorites-entity-type';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DbService) {}

  private checkEntityType(entityType: FavoritesEntityType) {
    if (!FavoritesEntityTypeValues.includes(entityType)) {
      throw new NotFoundException('Resource not found');
    }
  }

  findAll() {
    return this.db.getFavorites();
  }

  addEntity(entityType: FavoritesEntityType, id: string) {
    this.checkEntityType(entityType);

    return this.db.addEntityToFavorites(entityType, id);
  }

  removeEntity(entityType: FavoritesEntityType, id: string) {
    this.checkEntityType(entityType);

    return this.db.removeEntityFromFavorites(entityType, id);
  }
}
