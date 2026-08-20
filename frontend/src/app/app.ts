import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router, RouterLinkActive } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');

  authService = inject(Auth);
  private router = inject(Router);
 
  ngOnInit() {
    // Vérification explicite
    this.authService.profile().subscribe({
      next: (user) => console.log('✅ Appel profil réussi', user),
      error: (err) => console.log('❌ Erreur profil', err)
    });
  }
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/catalogue']);
    });
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/login-admin';
  }
}
