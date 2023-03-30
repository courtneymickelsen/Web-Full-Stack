import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model'
import { ContactService } from '../contact.service';
import { ContactsFilterPipe } from '../contacts-filter.pipe';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ContactsFilterPipe]
})

export class ContactListComponent implements OnInit {
  contacts: Contact[] = []
  subscription = new Subscription;
  term: string = '';

  constructor(private contactService: ContactService, private contactsFilterPipe: ContactsFilterPipe){}

  ngOnInit(){
    this.contacts = this.contactService.getContacts()
    this.contactService.contactChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts
      }
    )
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList
      }
    )
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
  
  onContactSelected(contact: Contact){
    this.contactService.contactSelectedEvent.emit(contact)
  }

  search(value: string){
    this.term = value
  }
}
