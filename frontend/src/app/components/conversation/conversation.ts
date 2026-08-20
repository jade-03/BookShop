import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { DatePipe } from '@angular/common';
import { CardBook } from "../commun/card-book/card-book";
import { CardMessage } from "../commun/card-message/card-message";
import { Message } from '../../interfaces/message';
import { form } from '@angular/forms/signals';
import { SendMessage } from '../../interfaces/send-message';
import { Auth } from '../../services/auth';
import { forkJoin } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-conversation',
  // imports: [DatePipe],
  templateUrl: './conversation.html',
  styleUrl: './conversation.css',
  imports: [DatePipe, CardMessage],
})
export class Conversation {
  // private messageService = inject(ApiService);

  // conversations = signal<Message[]>([]);
  // loading = signal(true);
  // error = signal<string | null>(null);
  today = new Date()

  // ngOnInit(): void {
  //   this.messageService.getMyMessages().subscribe((message: any) => {
  //     this.conversations.set(message);
  //   })
  // }
  private route = inject(ActivatedRoute);
  private service = inject(ApiService);
  private authService = inject(Auth)

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef;

  messages = signal<Message[]>([]);
  loading = signal(true);

  receiverId = 0;
  receiverPseudo = '';

currentUserId = signal<number | null>(null)

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      console.error('Aucun id trouvé dans l’URL');
      return;
    }

    this.receiverId = id;

    this.loadMessages();
  }

  messageModel = signal<SendMessage>({
    content: '',
    receiverId: this.receiverId
  })

  loadMessages(): void {

    forkJoin({
      message: this.service.getConversation(this.receiverId),
      user: this.authService.profile()
    }).subscribe(({message, user}) => {

        this.messages.set(message);
        this.loading.set(false);
        this.currentUserId.set(user.id)

        setTimeout(() => {
          this.scrollBottom();
        });
      })
  }

  sendMessage(content: string): void {

    if (!content.trim()) return;

  const payload: SendMessage = {
    content,
    receiverId: this.receiverId
  };

  console.log(payload);

  this.service.postConversation(this.receiverId, payload).subscribe({
      next: (message) => {

        this.messages.update(messages => [
          ...messages,
          message
        ]);

        setTimeout(() => {
          this.scrollBottom();
        });
      }
    });
  }

  isMyMessage(message: any): boolean {

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    return message.sender?.id === user.id;
  }

  scrollBottom(): void {

    if (!this.messagesContainer) return;

    this.messagesContainer.nativeElement.scrollTop =
      this.messagesContainer.nativeElement.scrollHeight;
  }
}
