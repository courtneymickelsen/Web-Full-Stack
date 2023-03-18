import { Injectable, EventEmitter } from '@angular/core';
import { Message } from '../messages/message.model';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({providedIn: 'root'})

export class ContactService {
  contacts: Contact[] = [];
  constructor() {
    this.contacts = MOCKCONTACTS;
  }
  contactSelectedEvent = new EventEmitter<Contact>()

  getContacts(): Contact[]{
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    for (const c of this.contacts) {
      if (c.id === id) {
        return c
      }
    }
    return null
  }
}