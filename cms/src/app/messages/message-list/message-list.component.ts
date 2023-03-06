import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})

export class MessageListComponent {
  messages: Message[] = [
    { id: '028', subject: 'Hello', msgText: 'This is a test message.', sender: 'Blake' },
    { id: '019', subject: 'Important Announcement', msgText: 'Please read this message carefully.', sender: 'Mallory' },
    { id: '022', subject: 'Reminder', msgText: 'Don\'t forget about our meeting tomorrow.',  sender: 'Keziah' }
  ];
  
  onAddMessage(message: Message){
    this.messages.push(message)
  }
}
