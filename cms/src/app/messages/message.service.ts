import { Injectable, EventEmitter, Output } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class MessageService {
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private HttpClient: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }
  @Output() messageSelectedEvent = new EventEmitter<Message>()
  @Output() messageChangedEvent = new EventEmitter<Message[]>()
  @Output() messageListChangedEvent = new Subject<Message[]>()

  getMessages(): Message[]{
    this.HttpClient.get<Message[]>('https://cms-database-17-default-rtdb.firebaseio.com/messages.json')
    .subscribe((messages: Message[]) => {
      this.messages = messages
      this.maxMessageId = this.getMaxId()
      this.messages.sort((a, b) => (a.sender > b.sender) ? 1 : -1)
      this.messageListChangedEvent.next(this.messages.slice())
    }, (error: any) => {
      console.log(error)
    })
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
    this.storeMessages()
  }

  storeMessages() {
    let messagesListString = JSON.stringify(this.messages)
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    this.HttpClient.put('https://cms-database-17-default-rtdb.firebaseio.com/messages.json', messagesListString, {headers: headers})
    .subscribe(() => {
      this.messageListChangedEvent.next(this.messages.slice())
    })
  }

  getMaxId(): number {
    let maxId = 0
    for (let message of this.messages) {
      let currentId = parseInt(message.id)
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }
}