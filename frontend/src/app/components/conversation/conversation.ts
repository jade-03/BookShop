import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { DatePipe } from '@angular/common';
import { CardMessage } from '../commun/card-message/card-message';
import { Message } from '../../interfaces/message';
import { form } from '@angular/forms/signals';
import { SendMessage } from '../../interfaces/send-message';
import { Auth } from '../../services/auth';
import { forkJoin } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { Discussion } from '../../interfaces/discussion';
import { User } from '../../interfaces/user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-conversation',
  imports: [ReactiveFormsModule, CardMessage],
  templateUrl: './conversation.html',
  styleUrl: './conversation.css',
})
export class Conversation {
  private route = inject(ActivatedRoute);
  private service = inject(ApiService);
  private authService = inject(Auth);
  private fb = inject(FormBuilder);

  // ---- Signals ----
  receiverId = signal<number | null>(null);
  listingId = signal<number | null>(null);
  currentUserId = signal<number | null>(null);
  messages = signal<Message[]>([]);
  loading = signal(true);
  discussions = signal<Discussion[]>([]);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  // ---- Formulaire ----
  messageForm = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  get content() {
    return this.messageForm.get('content')!;
  }

  // ---- Conversation active (header) ----
  activeConversation = computed(() => {
    const userId = this.receiverId();
    const listingId = this.listingId();
    if (!userId || !listingId) return null;

    return this.discussions().find(
      (conv) => conv.user.id === userId && conv.listing.id === listingId
    ) ?? null;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = Number(params.get('userId'));
      const listingId = Number(params.get('listingId'));

      if (!userId || !listingId) {
        console.warn('Paramètres invalides:', { userId, listingId });
        return;
      }

      this.receiverId.set(userId);
      this.listingId.set(listingId);
      this.loadMessages();
    });

    this.service.getMyMessages().subscribe({
      next: (discussions) => this.discussions.set(discussions),
      error: (err) => console.error('Erreur getMyMessages:', err),
    });
  }

  loadMessages(): void {
    const userId = this.receiverId();
    const listingId = this.listingId();
    if (!userId || !listingId) return;

    this.loading.set(true);

    forkJoin({
      message: this.service.getConversation(userId, listingId),
      user: this.authService.profile(),
    }).subscribe({
      next: ({ message, user }) => {
        this.currentUserId.set(user.id);
        this.messages.set(message);
        this.loading.set(false);
        setTimeout(() => this.scrollBottom());
      },
      error: (err) => {
        console.error('Erreur loadMessages:', err);
        this.loading.set(false);
      },
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) return;

    const userId = this.receiverId();
    const listingId = this.listingId();
    if (!userId || !listingId) return;

    const content = this.content.value?.trim();
    if (!content) return;

    this.service.sendMessage(userId, listingId, content).subscribe({
      next: (newMessage) => {
        this.messages.update((msgs) => [...msgs, newMessage]);
        this.messageForm.reset();
        setTimeout(() => this.scrollBottom());
      },
      error: (err) => console.error('Erreur sendMessage:', err),
    });
  }

  scrollBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  getInitials(pseudo: string): string {
    if (!pseudo) return '?';
    const cleaned = pseudo.replace(/[0-9_\-]+$/g, '').trim();
    const parts = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return cleaned.slice(0, 2).toUpperCase();
  }
}


