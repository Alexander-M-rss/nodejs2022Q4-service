import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  year?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  artistId?: string;
}
