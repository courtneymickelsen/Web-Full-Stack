import { Injectable, EventEmitter, Output } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({providedIn: 'root'})

export class MessageService {
  messages: Message[] = [];
  constructor() {
    this.messages = MOCKMESSAGES;
  }
  @Output() messageSelectedEvent = new EventEmitter<Message>()
  @Output() messageChangedEvent = new EventEmitter<Message[]>()

  getMessages(): Message[]{
    return this.messages.slice()
  }

  getMessage(id: string): Message {
    let message: any = this.messages.forEach((m) => {
      if (m.id === id){
        return m
      }
      return null
    })
    return message
  }

  addMessage(message: Message){
    this.messages.push(message)
    this.messageChangedEvent.emit(this.messages.slice())
  }
}