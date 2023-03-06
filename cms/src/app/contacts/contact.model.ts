export class Contact {
    // the id of the contact.
    public id: string;
    // the name of the contact.
    public name: string;
    // the email address of the contact.
    public email: string;
    // the phone number of the contact.
    public phone: string;
    // the URL of the photo image of the contact.
    public imageUrl: string;
    // this attribute is only applicable to group contacts. It is an array of other contacts that belong to the group.
    public group: any;

    constructor(id: string, name: string, email: string, phone: string, imageUrl: string, group: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.imageUrl = imageUrl;
    this.group = group;
    }
}