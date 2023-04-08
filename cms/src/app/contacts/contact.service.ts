import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class ContactService {
  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private HttpClient: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  contactSelectedEvent = new EventEmitter<Contact>()
  contactChangedEvent = new EventEmitter<Contact[]>()
  contactListChangedEvent = new Subject<Contact[]>()

  getContacts(): Contact[]{
    this.HttpClient.get<Contact[]>('http://localhost:3000/contacts')
    .subscribe((contacts: Contact[]) => {
      this.contacts = contacts
      this.maxContactId = this.getMaxId()
      this.contacts.sort((a, b) => (a.name > b.name) ? 1 : -1)
      this.contactListChangedEvent.next(this.contacts.slice())
    }, (error: any) => {
      console.log(error)
    }
  )
  return this.contacts.slice()
  }

  getContact(id: number): Contact {
    return this.contacts[id]
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.HttpClient.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.storeContacts();
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.HttpClient.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response) => {
          this.contacts[pos] = newContact;
          this.storeContacts();
        }
      );
  }

  deleteContact(contact: Contact) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.HttpClient.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response) => {
          this.contacts.splice(pos, 1);
          this.storeContacts();
        }
      );
  }
  storeContacts() {
    let contactsListString = JSON.stringify(this.contacts)
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    this.HttpClient.put('http://localhost:3000/contacts', contactsListString, {headers: headers})
    .subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice())
    })
  }

  getMaxId(): number {
    let maxId = 0
    for (let contact of this.contacts) {
      let currentId = parseInt(contact.id)
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }
}