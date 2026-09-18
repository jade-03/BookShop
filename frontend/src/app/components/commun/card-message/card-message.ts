import { Component, computed, input, signal } from '@angular/core';
import { Message } from '../../../interfaces/message';

@Component({
  selector: 'app-card-message',
  imports: [],
  templateUrl: './card-message.html',
  styleUrl: './card-message.css',
})
export class CardMessage {
  cardMessage = input.required<Message>()

  currentUserId = input<number | null>(null);  // ← input, pas input.required

  isMe = computed(() => {
  const currentId = this.currentUserId();
  const senderId = this.cardMessage()?.sender?.id;
  console.log('CardMessage - currentId:', currentId, 'senderId:', senderId);
  return currentId != null && senderId != null && Number(senderId) === Number(currentId);
});

 getFormattedTime(dateEntree: Date | string): string {
  if (!dateEntree) return '';

  // Sécurité au cas où la BDD renvoie parfois une string
  const dateValide = dateEntree instanceof Date ? dateEntree : new Date(dateEntree.toString().replace(' ', 'T'));

  const today = new Date();
  
  // Comparaison des jours (sans les heures)
  const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d2 = new Date(dateValide.getFullYear(), dateValide.getMonth(), dateValide.getDate());
  
  const differenceEnJours = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));

  if (differenceEnJours === 0) {
    // Aujourd'hui : On affiche l'heure formatée (ex: 12:51)
    const minutes = dateValide.getMinutes().toString().padStart(2, '0');
    const heures = dateValide.getHours().toString().padStart(2, '0');
    return `${heures}:${minutes}`;
  } else if (differenceEnJours === 1) {
    // Hier
    return "Hier";
  } else {
    // Dates antérieures : On affiche la date (ex: 15/09/2026)
    return dateValide.toLocaleDateString('fr-FR');
  }
}
}
