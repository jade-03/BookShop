import { Component, computed, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { User } from '../../interfaces/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-profil',
  imports: [RouterLink, ],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  private authService = inject(Auth);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router); // ✅ Ajouter Router

  users = signal<User | null>(null);
  usersProfil = signal<User | null>(null);
  error = signal<string | null>(null);
  loading = signal<boolean>(true); // ✅ Ajouter loading
  isOwnProfile = signal<boolean>(false); // ✅ Savoir si c'est son profil

  ngOnInit() {
    const userId = Number(this.activeRoute.snapshot.paramMap.get('id'));

    if (!userId) {
      // ✅ Pas d'ID -> Mon profil
      this.myProfil();
      return;
    }

    // ✅ Un ID -> Vérifier et charger
    this.checkProfil(userId);
  }

 isNotAdmin = computed(() => {
    const user = this.usersProfil();
    if (!user) return false;
    // Nettoyer la chaîne
  console.log('user:', user);
console.log('role:', user.role);
console.log('type:', typeof user.role);  
  return user.role !== 'ROLE_ADMIN';
  });


  private myProfil() {
    this.loading.set(true);
    this.isOwnProfile.set(true);

    this.authService.profile().subscribe({
      next: (data) => {
        this.users.set(data);
        this.usersProfil.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 401) {
          this.error.set('Veuillez vous connecter pour voir votre profil');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.error.set('Erreur lors du chargement de votre profil');
        }
        this.loading.set(false);
      },
    });
  }

  private checkProfil(userId: number) {
    this.loading.set(true);

    // ✅ Vérifier si l'utilisateur est connecté
    this.authService.profile().subscribe({
      next: (currentUser) => {
        // ✅ Si c'est MON profil
        if (currentUser.id === userId) {
          this.isOwnProfile.set(true);
          this.users.set(currentUser);
          this.usersProfil.set(currentUser);
          this.loading.set(false);
          console.log('✅ Mon profil (via ID)');
        }
        // ✅ Si c'est le profil d'un AUTRE
        else {
          this.isOwnProfile.set(false);
          this.publicProfil(userId);
        }
      },
      error: () => {
        // ❌ Non connecté -> charger profil public
        this.isOwnProfile.set(false);
        this.publicProfil(userId);
      },
    });
  }

  private publicProfil(userId: number) {
    this.authService.profileByUser(userId).subscribe({
      next: (data) => {
        this.usersProfil.set(data);
        this.users.set(null); // Pas d'utilisateur connecté
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.error.set("Cet utilisateur n'existe pas");
        } else {
          this.error.set('Erreur lors du chargement du profil');
        }
        this.loading.set(false);
      },
    });
  }
  getInitials(): string {
    const user = this.usersProfil();
    if (!user) return '?';

    const first = user.firstname?.charAt(0) || '';
    const last = user.lastname?.charAt(0) || '';
    return (first + last).toUpperCase() || user.pseudo?.charAt(0).toUpperCase() || '?';
  }
}
