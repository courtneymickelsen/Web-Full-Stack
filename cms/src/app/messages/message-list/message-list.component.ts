import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model'
import { MessageService } from '../message.service';
import { ContactService } from 'src/app/contacts/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})

export class MessageListComponent implements OnInit {
  messages: Message[] = []
  subscription = new Subscription;

  constructor(private messageService: MessageService){}

  ngOnInit(){
    this.messages = this.messageService.getMessages()
    this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages
      }
    )
    this.subscription = this.messageService.messageListChangedEvent.subscribe(
      (messagesList: Message[]) => {
        this.messages = messagesList
      }
    )
  }
  
  onMessageSelected(message: Message){
    this.messageService.messageSelectedEvent.emit(message)
  }

  onAddMessage(message: Message){
    this.messages.push(message)
  }
}
