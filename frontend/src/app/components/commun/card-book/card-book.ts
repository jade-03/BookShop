import { Component, computed, input, signal } from '@angular/core';
import { Listing } from '../../../interfaces/listing';
import { RouterLink } from "@angular/router";
import { ConditionLabels, BookCondition } from '../../../enums/book-condition';


@Component({
  selector: 'app-card-book',
  imports: [RouterLink],
  templateUrl: './card-book.html',
  styleUrl: './card-book.css',
})
export class CardBook {
  listingCard = input.required<Listing>()
  protected readonly ConditionLabels = ConditionLabels;
  protected readonly BookCondition = BookCondition;

  icon = signal<'' | '-fill'>('')

  switchIcon(event: MouseEvent){
    event.preventDefault();
  event.stopPropagation();

    this.icon.update((value =>
    value === '-fill' ? '' : '-fill'
  ))
  }
  ngOnInit() {
  console.log('📖 Listing reçu:', this.listingCard());
  console.log('📖 Book:', this.listingCard().book);
  console.log('📖 Auteur:', this.listingCard().book?.author);
}

  getDisplayAuthor = computed(() => {
  const author = this.listingCard()?.book?.author;
  if (!author) return 'Auteur inconnu';
  if (Array.isArray(author)) {
    return author.map(a => a.name).filter(Boolean).join(', ') || 'Auteur inconnu';
  }
  return author || author || 'Auteur inconnu';
});

  
  getBookTitle = computed(() => {
    return this.listingCard()?.book?.title || 'Titre inconnu';
  });
}
