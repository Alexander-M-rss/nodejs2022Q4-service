import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  artistId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  albumId?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  duration?: number;
}
