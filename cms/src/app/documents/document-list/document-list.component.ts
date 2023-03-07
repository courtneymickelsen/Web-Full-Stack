import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model'

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>()

  documents: Document[] = [
    {id: '1234', name: 'Lalala', description: 'This is my description', url: '/fake/url/lalala', children: ''},
    {id: '2345', name: 'Hello', description: 'This is another description', url: '/fake/url/hello', children: ''},
    {id: '3456', name: 'Books', description: 'This is the next description', url: '/fake/url/books', children: ''},
    {id: '4567', name: 'Scylla', description: 'This is my last decription', url: '/fake/url/scylla', children: ''},
  ]

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document)
  }
}
