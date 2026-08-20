import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-list-accordion',
  imports: [],
  templateUrl: './list-accordion.html',
  styleUrl: './list-accordion.css',
})
export class ListAccordion {
  titre = input.required<string>();
  target = input<string>('accordion-content');
  isOpen = signal<boolean>(true);

  toggleAccordion(): void {
    this.isOpen.update(value => !value);
  }
}
