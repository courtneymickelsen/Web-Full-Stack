import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Message } from '../message.model'
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})

export class MessageEditComponent {
  subject: string = ''
  msgText: string = ''
  currentSender: string = '17'

  @ViewChild('subject') subjectInputRef: ElementRef
  @ViewChild('msgText') msgTextInputRef: ElementRef
  @Output() addMessageEvent = new EventEmitter<Message>()
  
  constructor(private messageService: MessageService){}
  
  onSendMessage(event: Event){
    event.preventDefault();
    this.subject = this.subjectInputRef.nativeElement.value
    this.msgText = this.msgTextInputRef.nativeElement.value
    let messageObj = new Message('7', this.subject, this.msgText, this.currentSender)
    this.messageService.addMessage(messageObj)
    this.onClear()
  }

  onClear(){
    this.subjectInputRef.nativeElement.value = ''
    this.msgTextInputRef.nativeElement.value = ''
  }
}
