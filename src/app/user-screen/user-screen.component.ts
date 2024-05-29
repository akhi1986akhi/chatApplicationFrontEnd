import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-screen',
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.scss']
})
export class UserScreenComponent {
  formData = {
    fullName:'Amar Singh',
    email:'amar@gmail.com',
    contact:'9650082741',
    message:'Hi! this is test message !',
    id:''
  };
  messageTone = new Audio('../assets/Nada Dering Iphone Pangilan Masuk.mp3')
  step=1;
  private socket!: Socket;
  private readonly uri: string = 'http://localhost:3000';
  connectedUsers: any[] = [];
  selectedUser:any;
  constructor() {

    this.joinChat();
   
}
joinChat(){

    console.log(console.log(this.formData));
    this.socket = io(this.uri,{
      query:{
        username: this.formData.fullName,
        email: this.formData.email,
        contact: this.formData.contact
      }
    })
    console.log(this.socket)
    this.socket.on('users', (users: any[]) => {
      this.connectedUsers = users;
      console.log('Connected users:', this.connectedUsers);
      this.step=2;
      this.selectedUser = this.connectedUsers.find(item=> item.email==this.formData.email);

      console.log(this.selectedUser)
    });


    this.socket.on('private-message', (data) => {
      console.log(data)
      // clearFeedback()
      // messageTone.play()

  
        this.selectedUser.messages.push(data)
        this.messageTone.play()
        this.scrollToBottom()
      // this.addMessageToUI(false, data)
  })
  }

  sendMessage(){
    console.log(this.formData)
    if (this.formData.message === '') return
    // console.log(messageInput.value)
    const data = {
      name: this.formData.fullName,
      message: this.formData.message,
      targetId: this.getAdmin(),
      dateTime: new Date(),
      isOwnMessage:true,
    }
    this.socket.emit('private-message', data);
    // this.socket.emit('private-message', data);
    // this.addMessageToUI(true, data);
    
    console.log(this.formData)
    this.selectedUser.messages.push(data)
    this.formData.message = '';
    this.scrollToBottom()
   
  }


 addMessageToUI(isOwnMessage:any, data:any) {
  const messageContainer:any = document.getElementById('message-container');
    const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
            ${data.message}
            <span>${data.name} ${data.dateTime}</span>
        </p>
    </li>`


    messageContainer.innerHTML += element;
    this.scrollToBottom()
}


getAdmin(){
  const admin=this.connectedUsers.find(item=> item.email=='admin@gmail.com');

  return admin.id
}


scrollToBottom() {
  const messageContainer:any = document.getElementById('message-container');
    messageContainer.scroll(0, messageContainer.scrollHeight)
}
}
