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
    this.HttpClient.get<Message[]>('http://localhost:3000/messages')
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

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.HttpClient.post<{ message: string, messageEntry: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.messageEntry);
          this.storeMessages();
        }
      );
  }

  storeMessages() {
    let messagesListString = JSON.stringify(this.messages)
    const headers = new HttpHeaders({'Content-Type': 'application/json'})
    this.HttpClient.put('http://localhost:3000/messages', messagesListString, {headers: headers})
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