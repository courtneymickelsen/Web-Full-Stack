import { Component } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
  contact: Contact = {
    id: "1",
    name: "R. Kent Jackson",
    email: "jacksonk@byui.edu",
    phone: "208-496-3771",
    imageUrl: "../../assets/images/jacksonk.jpg",
    group: null
  }
}
