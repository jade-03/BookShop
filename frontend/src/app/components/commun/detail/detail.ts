import { Component, inject, signal } from '@angular/core';
import { Listing } from '../../../interfaces/listing';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-detail',
  imports: [RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail {
  private service = inject(ApiService);
  authService = inject(Auth)
  listing = signal<Listing | null>(null);
  private activeRoute = inject(ActivatedRoute);
  error = signal<string | null>(null);

  currentUser = signal<number | null>(null)
   divs: number[] = [];
  ngOnInit() {
    const listingId = Number(this.activeRoute.snapshot.paramMap.get('id'));
    if (!listingId) {
      this.error.set('Annonce non trouvée');
      return;
    }
    this.service.getListingById(listingId).subscribe((data) => {
      this.listing.set(data);
    });

    this.authService.profile().subscribe((user) =>{
      this.currentUser.set(user.id) 
    })
  }

  onCreate(){
    this.divs.push(this.divs.length + 1);
  }
}
