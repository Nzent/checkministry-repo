import { IsString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  orderDescription?: string;
}
