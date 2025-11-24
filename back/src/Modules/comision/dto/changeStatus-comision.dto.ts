import { IsBoolean, IsString } from 'class-validator';

export class ChangeStatusComisionDto {
  @IsBoolean()
  status: boolean;
  @IsString()
  comisionId: string;
}
