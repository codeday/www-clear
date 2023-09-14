import { TypedDocumentNode } from 'urql';
import { UiEdit } from '@codeday/topocons';
import { CreateModal, CreateModalProps } from './create';

export type UpdateModalProps<T extends TypedDocumentNode<any, any>> = CreateModalProps<T>;
export function UpdateModal<T extends TypedDocumentNode<any, any>>({ ...props }: UpdateModalProps<T>) {
  return <CreateModal openButtonIcon={<UiEdit />} {...props} />;
}
