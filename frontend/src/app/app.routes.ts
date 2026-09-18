import { Resolve, ResolveFn, Routes } from '@angular/router';
import { Catalogue } from './components/catalogue/catalogue';
import { Login } from './components/auth/login/login';
import { Registration } from './components/auth/registration/registration';
import { Parametres } from './components/parametres/parametres';
import { Profil } from './components/profil/profil';
import { Annonces } from './components/vendeur/annonces/annonces';
import { Detail } from './components/commun/detail/detail';
import { Messages } from './components/messages/messages';
import { NewBook } from './components/vendeur/new-book/new-book';
import { PageAdmin } from './components/admin/page-admin/page-admin';
import { Conversation } from './components/conversation/conversation';
import { adminGuard } from './guards/auth-guard';
import { Payement } from './components/payement/payement';
import { LoginAdmin } from './components/auth/login-admin/login-admin';
import { userGuard } from './guards/user-guard';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ApiService } from './services/api-service';
import { Auth } from './services/auth';

const resolveUserTitle: ResolveFn<string> = (route): Observable<string> =>{
  const authservice = inject(Auth)
  return authservice.profileByUser(route.params['id']).pipe(
    map(user => `Profil de ${user.pseudo}`)
  )
}

const resolveDetailBook: ResolveFn<string> = (route): Observable<string> =>{
  const service = inject(ApiService)
  return service.getListingById(route.params['id']).pipe(
    map(book => book.title)
  )
}

export const routes: Routes = [
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
  { path: 'catalogue', title: "Catalogue", component: Catalogue },
  { path: 'newbook', title:"Ajouter un livre" ,component: NewBook, canActivate: [userGuard] },
  { path: 'login', title:"Connexion", component: Login },
  { path: 'register', title:"Inscription", component: Registration },
  { path: 'parametres', title:"Paramètre", component: Parametres, canActivate: [userGuard] },
  { path: 'profil', title:"Mon profil", component: Profil, canActivate: [userGuard] },
  { path: 'profil/:id', title: resolveUserTitle, component: Profil, canActivate: [userGuard] },
  { path: 'listing/:id', title: resolveDetailBook, component: Detail },
  {
    path: 'messageries',
    component: Messages,
    title: "Messagerie",
    canActivate: [userGuard],
    children: [
      {
        path: 'conversation/:userId/:listingId',
        component: Conversation,
      },
    ],
  },
  { path: 'annonces', component: Annonces, canActivate: [userGuard] },
  { path: 'administration', redirectTo: 'login-admin', pathMatch: 'full' },
  { path: 'login-admin', component: LoginAdmin },
  { path: 'admin', component: PageAdmin, canActivate: [adminGuard] },
  { path: 'annonce/:id/payement', component: Payement, canActivate: [userGuard] },
];
