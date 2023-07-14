import { DocumentData, DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

import { InventoryItem } from '../types';

export function docToInventoryItem(doc: DocumentSnapshot<DocumentData>): InventoryItem {
  return { ...doc.data(), id: doc.id } as InventoryItem;
}

export function docsToInventoryItems(docs: QuerySnapshot<DocumentData>): InventoryItem[] {
  return docs.docs.map(doc => docToInventoryItem(doc));
}
