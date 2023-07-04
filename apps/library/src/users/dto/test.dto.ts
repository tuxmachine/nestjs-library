import { Colors } from '@app/shared/some-enum';

export class GetUsersParamsDto {
  // @Kamil this inline typing is causing the trouble. Extracting it to a
  // separate node resolves the issue. When creating this reproduction, it
  // appeared when switching to monorepo
  filters?: {
    shirtColor: Colors[];
  };
}
