import { Component, input } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-message',
  imports: [DatePipe],
  templateUrl: './card-message.html',
  styleUrl: './card-message.css',
})
export class CardMessage {
  cardMessage = input.required<Message>()
}
