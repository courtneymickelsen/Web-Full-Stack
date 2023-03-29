import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})

export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  @ViewChild('f') documentForm: NgForm;


constructor(private documentService: DocumentService, private router: Router, private route: ActivatedRoute){
}
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        let id = params['id']
        if (!id) {
          this.editMode = false
          return
        }
        this.originalDocument = this.documentService.getDocument(id)
        if (!this.originalDocument) {
          return
        }
        this.editMode = true
        this.document = JSON.parse(JSON.stringify(this.originalDocument))
      }
    )
  }

  onCancel(){
    this.router.navigate(['/documents'])
  }

  onRemoveItem(i: any){
    console.log("onRemoveItem - " + i)
  }

  onSubmit(f: NgForm){
    let value = f.value
    let newDocument = new Document(
      value.id,
      value.name,
      value.description,
      value.url,
      value.children
    )
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument)
    } else {
      this.documentService.addDocument(newDocument)
    }
    this.router.navigate(['/documents'])
  }
}