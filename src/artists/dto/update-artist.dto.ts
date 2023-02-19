import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  grammy?: boolean;
}
