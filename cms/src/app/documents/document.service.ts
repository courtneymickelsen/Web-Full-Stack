import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from 'express';

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
    this.HttpClient.get<Document[]>('http://localhost:3000/documents')
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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.HttpClient.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.storeDocuments();
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.HttpClient.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response) => {
          this.documents[pos] = newDocument;
          this.storeDocuments();
        }
      );
  }

  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.HttpClient.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response) => {
          this.documents.splice(pos, 1);
          this.storeDocuments();
        }
      );
  }

  storeDocuments() {
    let documentsListString = JSON.stringify(this.documents)
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    this.HttpClient.put('http://localhost:3000/documents/', documentsListString, {headers: headers})
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