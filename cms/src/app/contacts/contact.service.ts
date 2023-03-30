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
    this.HttpClient.get<Contact[]>('https://cms-database-17-default-rtdb.firebaseio.com/contacts.json')
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

  addContact(newContact: Contact) {
    if (!newContact) {
      return
    }
    this.maxContactId++
    newContact.id = this.maxContactId.toString()
    this.contacts.push(newContact)
    this.storeContacts()
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }
    let pos = this.contacts.indexOf(originalContact)
    if (pos < 0) {
      return
    }
    newContact.id = originalContact.id
    this.contacts[pos] = newContact
    this.storeContacts()
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts()
  }

  storeContacts() {
    let contactsListString = JSON.stringify(this.contacts)
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    this.HttpClient.put('https://cms-database-17-default-rtdb.firebaseio.com/contacts.json', contactsListString, {headers: headers})
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