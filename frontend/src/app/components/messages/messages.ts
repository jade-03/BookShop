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

  discussions = signal<Discussion[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeId = signal<number | null>(null);

  ngOnInit(): void {
    const savedId = localStorage.getItem('activeChatId')
    if (savedId) {
      const idNumerique = Number(savedId);
      this.activeId.set(idNumerique);
    
    }
    this.messageService.getMyMessages().subscribe((message: any) => {
      this.discussions.set(message);
    })
  }

  selectConversation(c: number) {
    this.activeId.set(c);

    localStorage.setItem('activeChatId', c.toString())
  }

  getInitials(pseudo: string): string {
  if (!pseudo) return '?';

  const cleaned = pseudo.replace(/[0-9_\-]+$/g, '').trim();

  const parts = cleaned
    .replace(/([a-z])([A-Z])/g, '$1 $2')   // "MarieD" → "Marie D"
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}
}
