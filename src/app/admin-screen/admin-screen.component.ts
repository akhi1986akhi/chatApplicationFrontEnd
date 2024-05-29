import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent {
  private socket!: Socket;
  private readonly uri: string = 'http://localhost:3000';
  messageTone = new Audio('../assets/Nada Dering Iphone Pangilan Masuk.mp3')
  connectedUsers: any[] = [];
  usersList: any[] = [
    {
      username: 'Akhilesh Kumar',
      email: 'akhi1986@hotmail.com',
      contact: '700776116'
    },
    {
      username: 'Amar Kumar',
      email: 'amar6@hotmail.com',
      contact: '700776116'
    },
    {
      username: 'Akhilesh Kumar',
      email: 'akhi1986@hotmail.com',
      contact: '700776116'
    },
    {
      username: 'Amit Kumar',
      email: 'amit@hotmail.com',
      contact: '700776116'
    },
    {
      username: 'Amit Kumar',
      email: 'amit@hotmail.com',
      contact: '700776116'
    }
  ];
  formData: any = {
    fullName: '',
    email: '',
    contact: '',
    id:'',
    message:''
  }

  constructor() {
    this.joinChat();
  }


selectedUser:any;
  SelectUser(user: any) {
    console.log(user)
    this.formData = {
      fullName: user.username,
      email: user.email,
      contact: user.contact,
      id:user.id,
    }

    this.selectedUser= user;
  }

  joinChat() {

    console.log(console.log(this.formData));
    this.socket = io(this.uri, {
      query: {
        username: 'Admin',
        email: 'admin@gmail.com',
        contact: '9318300211'
      }
    })
    this.socket.on('users', (users: any[]) => {
      this.connectedUsers = users;
      console.log('Connected users:', this.connectedUsers);
    });

    this.socket.on('private-message', (data) => {
      console.log(data)
      // clearFeedback()
      this.messageTone.play()
      // this.addMessageToUI(false, data);

      const index =  this.connectedUsers.findIndex(item=> item.id==data.senderId)
      if(index != -1){
       this.connectedUsers[index].messages.push(data)
       console.log(this.connectedUsers);
       this.scrollToBottom()
      }
  })

  }

  sendMessage() {

    console.log(this.formData)
    if (this.formData.message === '') return
    // console.log(messageInput.value)
    const data = {
      name: 'Admin',
      message: this.formData.message,
      targetId: this.formData.id,
      dateTime: new Date(),
      isOwnMessage:true

    }
    this.socket.emit('private-message', data);
    // this.socket.emit('private-message', data);
    // this.addMessageToUI(true, data);
    
    console.log(this.formData)

   const index =  this.connectedUsers.findIndex(item=> item.id==this.formData.id)
   if(index != -1){
    this.connectedUsers[index].messages.push(data)
    console.log(this.connectedUsers);
    this.scrollToBottom()
   }
    this.formData.message = '';
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
      // messageContainer.innerHTML += element;
      messageContainer.insertAdjacentHTML('beforeend', element);
      
  }
 scrollToBottom() {
  const messageContainer:any = document.getElementById('message-container');
    messageContainer.scroll(0, messageContainer.scrollHeight)
}
}
