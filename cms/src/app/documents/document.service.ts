import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({providedIn: 'root'})

export class DocumentService {
  documents: Document [] = [];
  constructor() {
    this.documents = MOCKDOCUMENTS;
  }
  documentSelectedEvent = new EventEmitter<Document>()
  documentChangedEvent = new EventEmitter<Document[]>()

  getDocuments(): Document[]{
    return this.documents.slice();
  }

  getDocument(id: number): Document {
    return this.documents[id]
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
 }
}