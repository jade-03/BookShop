import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginUser } from '../../../interfaces/login-user';
import { email, form, required, submit, FormField } from '@angular/forms/signals';
import { Auth } from '../../../services/auth';

type Alert = 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  alert = signal<Alert | null>(null);
  messageAlert = signal<string | null>(null);

  showAlert(message: string, type: Alert, timeout = 3000) {
    this.messageAlert.set(message);
    this.alert.set(type);

    if (timeout) {
      setTimeout(() => this.closeAlert(), timeout);
    }
  }

  closeAlert() {
    this.messageAlert.set(null);
    this.alert.set(null);
  }

  loginModel = signal<LoginUser>({
    username: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.username, { message: "L'email est requis" });
    email(fieldPath.username, { message: 'Entrez un adresse email valide' });
    required(fieldPath.password, { message: 'Le mot de passe est requis' });
  });

  onSubmit(event: Event) {
    this.closeAlert(); // reset alert
    event.preventDefault();

    if (!this.loginForm().valid()) {
      alert('Veuillez remplir tous les champs correctement');
      return;
    }

    submit(this.loginForm, async () => {
      const credentials = this.loginModel();
      this.authService.login(credentials).subscribe({
        next: () => {
          this.showAlert('Connexion Réussie', 'success', 3000);
          setTimeout(() => {
            this.router.navigate(['/catalogue']);
          }, 4000);
        },
        error: (err) => {
          this.handleBackendError(err);
        },
      });
    });
  }

  handleBackendError(err: any) {
    const code = err.error?.code || err.error?.message;

    switch (code) {
      case 'EMAIL_NOT_EXISTS':
        this.showAlert('Email introuvable', 'danger');
        break;

      case 'PASSWORD_INVALID':
        this.showAlert('Mot de passe incorrect', 'danger');
        break;

      default:
        this.showAlert('Une erreur est survenue', 'danger');
    }
  }
}
