import { IsOptional, IsString, IsDate } from 'class-validator';

export class FilterNewsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  toDate?: Date;
}
