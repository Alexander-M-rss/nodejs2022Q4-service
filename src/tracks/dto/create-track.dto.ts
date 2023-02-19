import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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
  duration: number;
}
