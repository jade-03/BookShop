import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../interfaces/order';

@Component({
  selector: 'app-payement',
  imports: [],
  templateUrl: './payement.html',
  styleUrl: './payement.css',
})
export class Payement {
  private service = inject(ApiService)
  private activeRoute = inject(ActivatedRoute)
  error = signal<string | null>(null);

  orderDetail = signal<Order | null>(null)
  payement = signal<Payement | null>(null)

  ngOnInit(){
    const id = Number(this.activeRoute.snapshot.paramMap.get('id'))

    if (!id) {
      this.error.set('Annonce non trouvée');
      return;
    }
  }
}
