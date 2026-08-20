import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api-service';
import { Book } from '../../../interfaces/book';
import { User } from '../../../interfaces/user';
import { Listing } from '../../../interfaces/listing';
import { ActivatedRoute, Router } from '@angular/router';
import { Detail } from '../../commun/detail/detail';
import { CardBook } from '../../commun/card-book/card-book';

@Component({
  selector: 'app-annonces',
  imports: [CardBook],
  templateUrl: './annonces.html',
  styleUrl: './annonces.css',
})
export class Annonces {
  private service = inject(ApiService);
  private router = inject(Router);

  listings = signal<Listing[]>([]);

  ngOnInit() {
    this.service.getListingsByUser().subscribe((listing) => {
      this.listings.set(listing);
    });
  }

  goToEdit(id: number) {
    this.router.navigate(['/annonces/edit', id]);
  }

  deleteListing(id: number) {
    this.service.deleteListing(id).subscribe(() => {
      this.listings.update(list =>
        list.filter(l => l.id !== id)
      );
    });
  }
}
