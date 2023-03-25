import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model'
import { DocumentService } from '../document.service'

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})

export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = []
  subscription = new Subscription;

  constructor(private documentService: DocumentService){}
  
  ngOnInit(){
    this.documents = this.documentService.getDocuments()
    this.documentService.documentChangedEvent.subscribe(
      (documents: Document[]) => {
        this.documents = documents
      }
    )
    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documentsList: Document[]) => {
        this.documents = documentsList
      }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
  onSelectedDocument(document: Document){
    this.documentService.documentSelectedEvent.emit(document)
  }
}