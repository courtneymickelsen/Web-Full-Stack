import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})

export class ContactEditComponent implements OnInit {
  groupContacts: Contact[] = [];
  originalContact: Contact;
  contact: Contact;
  editMode: boolean = false;
  @ViewChild('f') contactForm: NgForm;

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute){
  }

  onCancel(){
    this.router.navigate(['/contacts'])
  }
  
  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
  }

  onSubmit(f: NgForm){
    let value = f.value
    console.log('value')
    console.log(value)
    let newContact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    )
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact)
    } else {
      this.contactService.addContact(newContact)
    }
    this.editMode = false
    this.contactForm.reset()
    this.router.navigate(['/contacts'])
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        let id = params['id']
        if (!id) {
          this.editMode = false
          return
        }
        this.originalContact = this.contactService.getContact(id)
        if (!this.originalContact) {
          return
        }
        this.editMode = true
        this.contact = JSON.parse(JSON.stringify(this.originalContact))
        if (this.contact.group) {
          this.groupContacts = this.contact.group
        }
      }
    )
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
      return;
    }
    this.groupContacts.push(selectedContact);
  }
}