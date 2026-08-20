import { Routes } from '@angular/router';
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
import { Edit } from './components/vendeur/edit/edit';
import { Payement } from './components/payement/payement';
import { LoginAdmin } from './components/auth/login-admin/login-admin';

export const routes: Routes = [
  { path: 'bookshop', redirectTo: 'catalogue', pathMatch: 'full' },
  { path: 'catalogue', component: Catalogue },
  { path: 'newbook', component: NewBook },
  { path: 'login', component: Login },
  { path: 'register', component: Registration },
  { path: 'parametres', component: Parametres },
  { path: 'profil', component: Profil },
  { path: 'profil/:id', component: Profil },
  { path: 'listing/:id', component: Detail },
  {
    path: 'messageries',
    component: Messages,
    children: [
      {
        path: 'message/:id',
        component: Conversation,
      },
    ],
  },
  { path: 'annonces', component: Annonces },
  { path: '', redirectTo: 'login-admin', pathMatch: 'full' },
  { path: 'login-admin', component: LoginAdmin },
  { path: 'admin', component: PageAdmin, canActivate: [adminGuard] },
  { path: 'annonce/:id/payement', component: Payement },
];
