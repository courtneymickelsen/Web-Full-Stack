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

  getDocuments(): Document[]{
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    let document: any = this.documents.forEach((d) => {
      if (d.id === id){
        return d
      }
      return null
    })
    return document
  }
}