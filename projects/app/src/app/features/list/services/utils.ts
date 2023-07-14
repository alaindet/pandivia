import { DocumentData, DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { ListItem } from '../types';

export function docToListItem(doc: DocumentSnapshot<DocumentData>): ListItem {
  return { ...doc.data(), id: doc.id } as ListItem;
}

export function docsToListItems(docs: QuerySnapshot<DocumentData>): ListItem[] {
  return docs.docs.map(doc => docToListItem(doc));
}
