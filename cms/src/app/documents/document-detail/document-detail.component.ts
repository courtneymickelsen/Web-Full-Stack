import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service.spec';
import { Document } from '../document.model'
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})

export class DocumentDetailComponent implements OnInit {
  document: Document
  nativeWindow: any
  
  constructor(private documentService: DocumentService,
    private windRefService: WindRefService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.document = this.documentService.getDocument(params['id']);
      }
    )
    this.nativeWindow = this.windRefService.getNativeWindow()
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url)
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.nativeWindow.history.back();
 }
 
    
}

