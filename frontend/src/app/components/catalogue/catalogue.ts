import { Component, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { Book } from '../../interfaces/book';
import { forkJoin } from 'rxjs';
import { Category } from '../../interfaces/category';
import { Author } from '../../interfaces/author';
import { ListAccordion } from '../commun/list-accordion/list-accordion';
import { CardBook } from '../commun/card-book/card-book';
import { Listing } from '../../interfaces/listing';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CardBook, ListAccordion],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})

export class Catalogue {
  private serviceBook = inject(ApiService);
  listings = signal<Listing[]>([]);
  categories = signal<Category[]>([]);
  authors = signal<Author[]>([]);
  selectAuteur = signal<string[]>([]);
  selectCategory = signal<string>('Tous');
  searchText = signal<string>('');

  ngOnInit() {

    forkJoin({
      listing: this.serviceBook.getListings(),
      category: this.serviceBook.getCategories(),
      author: this.serviceBook.getAuthor(),
    }).subscribe(({ listing, category, author }) => {
      this.listings.set(listing);
      this.categories.set(category);
      this.authors.set(author);
    });
  }

  filterBtn(text: string) {
    this.selectCategory.set(text);
  }

  onChangeChckBox(nom: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectAuteur.set([...this.selectAuteur(), nom]);
    } else {
      this.selectAuteur.set(this.selectAuteur().filter((nomA) => nomA !== nom));
    }
  }

  onSearch(value: string) {
    this.searchText.set(value);
  }

  filtreListing = computed(() => {
    let filtered = this.listings();

    const selectCategoryValue = this.selectCategory();
    if (selectCategoryValue && selectCategoryValue !== 'Tous') {
      filtered = filtered.filter((listing) => listing.category.name === selectCategoryValue);
      console.log(selectCategoryValue)
    }

    const selectedAuteurs = this.selectAuteur();
    if (selectedAuteurs.length > 0) {
      filtered = filtered.filter((listing) => {
        const bookAuthors = listing.book.author;

        if (!bookAuthors || bookAuthors.length === 0) return false;

        return bookAuthors.some((author: any) => selectedAuteurs.includes(author.name));
      });
    }

    const search = this.searchText();
    if (search) {
      filtered = filtered.filter((listing) =>
        listing.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  });

}
