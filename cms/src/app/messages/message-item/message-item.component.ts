import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { Contact } from 'src/app/contacts/contact.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: String;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    let contact: Contact
    contact = this.contactService.getContact(Number(this.message.sender));
    this.messageSender = contact.name
  }
 }
