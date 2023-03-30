import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class DocumentService {
  documents: Document [] = [];
  maxDocumentId: number;

  constructor(private HttpClient: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  documentSelectedEvent = new EventEmitter<Document>()
  documentChangedEvent = new EventEmitter<Document[]>()
  documentListChangedEvent = new Subject<Document[]>()

  getDocuments(): Document[] {
    this.HttpClient.get<Document[]>('https://cms-database-17-default-rtdb.firebaseio.com/documents.json')
    .subscribe((documents: Document[]) => {
      this.documents = documents
      this.maxDocumentId = this.getMaxId()
      this.documents.sort((a, b) => (a.name > b.name) ? 1 : -1)
      this.documentListChangedEvent.next(this.documents.slice())
    }, (error: any) => {
      console.log(error)
    }
    )
    return this.documents.slice()
  }

  getDocument(id: number): Document {
    return this.documents[id]
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return
    }
    this.maxDocumentId++
    newDocument.id = this.maxDocumentId.toString()
    this.documents.push(newDocument)
    this.storeDocuments()
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return
    }
    let pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return
    }
    newDocument.id = originalDocument.id
    this.documents[pos] = newDocument
    this.storeDocuments()
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
    this.storeDocuments()
  }

  storeDocuments() {
    let documentsListString = JSON.stringify(this.documents)
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    this.HttpClient.put('https://cms-database-17-default-rtdb.firebaseio.com/documents.json', documentsListString, {headers: headers})
    .subscribe(() => {
      this.documentListChangedEvent.next(this.documents.slice())
    })
  }

  getMaxId(): number {
    let maxId = 0
    for (let document of this.documents) {
      let currentId = parseInt(document.id)
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }
}