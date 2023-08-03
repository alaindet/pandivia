import { ActionsMenuItem } from '@app/common/components';
import { BackButtonStatus } from '@app/common/types/back-button-status';
import { Counters } from '../../types';

export type StackedLayoutViewModel = {
  title: string;
  withSearch: boolean;
  searchQuery: string;
  headerActions: ActionsMenuItem[];
  headerCounters: Counters | null;
  backButton: BackButtonStatus;
};
