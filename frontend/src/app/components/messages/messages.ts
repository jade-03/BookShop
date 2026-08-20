import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Message } from '../../interfaces/message';
import { CardMessage } from '../commun/card-message/card-message';
import { Discussion } from '../../interfaces/discussion';

@Component({
  selector: 'app-messages',
  imports: [ RouterLink, RouterOutlet,],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})

export class Messages {
  private messageService = inject(ApiService);
  private router = inject(Router);
  

  discussions = signal<Discussion[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.messageService.getMyMessages().subscribe((message: any) => {
      this.discussions.set(message);
    })
  }

  // loadConversations(): void {
  //   this.messageService.getMyMessages().subscribe({
  //     next: (messages: any[]) => {

  //       const currentUserId = this.getCurrentUserId();
  //       const conversationsMap = new Map<number, Conversation>();

  //       discussion.forEach(msg => {

  //         const otherUser =
  //           msg.sender.id === currentUserId
  //             ? msg.receiver
  //             : msg.sender;

  //         const existing = conversationsMap.get(otherUser.id);

  //         if (!existing) {

  //           conversationsMap.set(otherUser.id, {
  //             userId: otherUser.id,
  //             userPseudo: otherUser.pseudo,
  //             lastMessage: msg.content,
  //             lastMessageDate: msg.sendAt,
  //           });

  //         } else if (
  //           new Date(msg.sendAt) >
  //           new Date(existing.lastMessageDate)
  //         ) {

  //           existing.lastMessage = msg.content;
  //           existing.lastMessageDate = msg.sendAt;
  //         }
  //       });

  //       this.conversations.set(
  //         Array.from(conversationsMap.values()).sort(
  //           (a, b) =>
  //             new Date(b.lastMessageDate).getTime() -
  //             new Date(a.lastMessageDate).getTime()
  //         )
  //       );

  //       this.loading.set(false);
  //     },
  //     error: () => {
  //       this.error.set('Erreur lors du chargement des conversations');
  //       this.loading.set(false);
  //     }
  //   });
  // }

  getInitials(name: string): string {
    return name?.charAt(0).toUpperCase() ?? '?';
  }

  // private getCurrentUserId(): number {
  //   const user = localStorage.getItem('user');

  //   if (!user) return 0;

  //   return JSON.parse(user).id;
  // }
}
