import { Colors } from '@app/shared/some-enum';

export class GetUsersParamsDto {
  filters?: {
    shirtColor: Colors[];
  };
}
