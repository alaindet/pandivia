import { ActionsMenuItem } from '@app/common/components';
import { BackButtonStatus } from '@app/common/types/back-button-status';

export type StackedLayoutViewModel = {
  title: string;
  headerActions: ActionsMenuItem[];
  backButton: BackButtonStatus;
};
