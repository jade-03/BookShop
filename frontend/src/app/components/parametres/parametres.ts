import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, ɵEmptyOutletComponent, RouterLinkActive } from "@angular/router";
import { Profil } from '../profil/profil';

@Component({
  selector: 'app-parametres',
  imports: [RouterLink, RouterOutlet,],
  templateUrl: './parametres.html',
  styleUrl: './parametres.css',
})
export class Parametres {

}
