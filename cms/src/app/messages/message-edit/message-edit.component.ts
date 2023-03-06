import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Message } from '../message.model'

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})

export class MessageEditComponent implements AfterViewInit {
  subject: string = ''
  msgText: string = ''
  currentSender: string = 'Courtney Mickelsen'

  @ViewChild('subject') subjectInputRef: ElementRef
  @ViewChild('msgText') msgTextInputRef: ElementRef
  
  ngAfterViewInit() {
    this.subject = this.subjectInputRef.nativeElement.value
    this.msgText = this.msgTextInputRef.nativeElement.value
  }

  @Output() addMessageEvent = new EventEmitter<Message>()
  
  onSendMessage(event: Event){
    event.preventDefault();
    let messageObj = new Message('017', this.subject, this.msgText, this.currentSender)
    this.addMessageEvent.emit(messageObj)
    this.onClear()
  }

  onClear(){
    this.subjectInputRef.nativeElement.value = ''
    this.msgTextInputRef.nativeElement.value = ''
  }
}
