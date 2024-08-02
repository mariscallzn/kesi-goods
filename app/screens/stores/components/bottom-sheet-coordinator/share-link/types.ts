import {ActionCallback} from '@/inf/multiViewRenderer';
import {Store} from '@/model/types';

export type ShareLinkProps = {
  action: ActionCallback<ShareLinkMetadata>;
  metadata: ShareLinkMetadata;
};

export type ShareLinkMetadata = {
  store: Store;
  button: string;
};
