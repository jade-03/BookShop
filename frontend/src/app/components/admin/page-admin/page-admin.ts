import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Listing } from '../../../interfaces/listing';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Book } from '../../../interfaces/book';
import { Author } from '../../../interfaces/author';
import { Category, NewCategory } from '../../../interfaces/category';
import { ApiService } from '../../../services/api-service';
import { User } from '../../../interfaces/user';
import { form, minLength, required } from '@angular/forms/signals';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
declare var bootstrap: any;
type Alert = 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-page-admin',
  imports: [DatePipe, FormsModule],
  templateUrl: './page-admin.html',
  styleUrl: './page-admin.css',
})
export class PageAdmin {
  // Données principales
  listings = signal<Listing[]>([]);
  users = signal<User[]>([]);
  books = signal<Book[]>([]);
  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);

  private service = inject(ApiService);

  currentPage = signal<number>(1);
  itemsPerPage = 10;
  totalPages = computed(() => Math.ceil(this.filteredListings().length / this.itemsPerPage));

  // Données filtrées
  filteredListings = signal<Listing[]>([]);
  filteredUsers = signal<User[]>([]);
  filteredBooks = signal<Book[]>([]);
  filteredAuthors = signal<Author[]>([]);
  filteredCategories = signal<Category[]>([]);

  // Termes de recherche
  searchTerm = signal<string>('');
  statusFilter = signal<string>('all');
  userSearchTerm = signal<string>('');
  bookSearchTerm = signal<string>('');
  authorSearchTerm = signal<string>('');
  categorySearchTerm = signal<string>('');

  // Onglet actif
  activeTab = signal<'listings' | 'users' | 'books' | 'authors' | 'categories'>('listings');

  totalListings = computed(() => this.listings().length);
  pendingListings = computed(() => this.listings().filter((l) => l.statut === 'for_sale').length);
  activeSellers = computed(() => this.users().filter((u) => u.role === 'ROLE_USER').length);
  totalRevenue = signal<number>(0);

  today = new Date();

  router = inject(Router);
  ngOnInit() {
    forkJoin({
      listing: this.service.getListings(),
      user: this.service.getUser(),
      book: this.service.getBooks(),
      author: this.service.getAuthor(),
    }).subscribe(({ listing, user, book, author }) => {
      this.filteredListings.set(listing);
      this.filteredUsers.set(user);
      this.filteredBooks.set(book);
      this.filteredAuthors.set(author);
    });

    this.loadCategories();
    console.log('Tous les livres:', this.books());
    console.log('Premier livre:', this.books()[0]);
    console.log('Auteurs du premier livre:', this.books()[0]?.author);
  }

  loadCategories() {
    this.service.getCategories().subscribe({
      next: (categories) => {
        this.filteredCategories.set(categories);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  @ViewChild('modalCategory') modalElement!: ElementRef;

  alert = signal<Alert | null>(null);
  messageAlert = signal<string | null>(null);

  categoryModel = signal<NewCategory>({
    name: '',
  });

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

  categoryForm = form(this.categoryModel, (fieldPath) => {
    required(fieldPath.name, { message: 'Entrez une catégorie' });
    minLength(fieldPath.name, 2, { message: 'Votre mot de passe doit minimum 8 caractère' });
  });

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const modalInstance = bootstrap.Modal.getOrCreateInstance(this.modalElement.nativeElement);

    const credentials = form.value;

    this.service.postCategory(credentials).subscribe({
      next: () => {
        this.showAlert('Catégorie ajoutée', 'success', 3000);
        console.log(form.value);

        setTimeout(() => {
          modalInstance.hide();
          this.loadCategories();
        }, 4000);
      },
      error(err) {
        alert('Error -' + err.error);
      },
    });
  }

  // Filtres pour les annonces
  filterTable() {
    let filtered = [...this.listings()];

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(term) ||
          listing.user.pseudo.toLowerCase().includes(term),
      );
    }

    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter((listing) => listing.statut === this.statusFilter());
    }

    this.filteredListings.set(filtered);
    this.currentPage.set(1);
  }

  // Filtres pour les utilisateurs
  filterUsers() {
    let filtered = [...this.users()];

    if (this.userSearchTerm()) {
      const term = this.userSearchTerm().toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.pseudo.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
      );
    }

    this.filteredUsers.set(filtered);
  }

  // Filtres pour les livres
  filterBooks() {
    let filtered = [...this.books()];

    if (this.bookSearchTerm()) {
      const term = this.bookSearchTerm().toLowerCase();
      filtered = filtered.filter(
        (book) => book.title.toLowerCase().includes(term) || book.isbn.includes(term),
      );
    }

    this.filteredBooks.set(filtered);
  }

  // Filtres pour les auteurs
  filterAuthors() {
    let filtered = [...this.authors()];

    if (this.authorSearchTerm()) {
      const term = this.authorSearchTerm().toLowerCase();
      filtered = filtered.filter((author) => author.name.toLowerCase().includes(term));
    }

    this.filteredAuthors.set(filtered);
  }

  // Filtres pour les catégories
  filterCategories() {
    let filtered = [...this.categories()];

    if (this.categorySearchTerm()) {
      const term = this.categorySearchTerm().toLowerCase();
      filtered = filtered.filter((category) => category.name.toLowerCase().includes(term));
    }

    this.filteredCategories.set(filtered);
  }

  // Pagination pour les annonces
  getPaginatedListings(): Listing[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredListings().slice(start, end);
  }

  getPaginatedUsers(): User[] {
    return this.filteredUsers().slice(0, 20);
  }

  getPaginatedBooks(): Book[] {
    return this.filteredBooks().slice(0, 20);
  }

  getPaginatedAuthors(): Author[] {
    return this.filteredAuthors().slice(0, 20);
  }

  getPaginatedCategories(): Category[] {
    return this.filteredCategories().slice(0, 20);
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  // Méthodes pour les badges
  getConditionBadge(condition: string): string {
    const badges: Record<string, string> = {
      new: 'bg-success',
      like_new: 'bg-info',
      good: 'bg-primary',
      acceptable: 'bg-warning',
      poor: 'bg-danger',
    };
    return badges[condition] || 'bg-secondary';
  }

  getConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
      new: 'Neuf',
      like_new: 'Comme neuf',
      good: 'Bon état',
      acceptable: 'État correct',
      poor: 'Mauvais état',
    };
    return labels[condition] || condition;
  }

  getStatusBadge(statut: string): string {
    const badges: Record<string, string> = {
      for_sale: 'bg-success',
      sold: 'bg-secondary',
      reserved: 'bg-warning text-dark',
    };
    return badges[statut] || 'bg-secondary';
  }

  getStatusLabel(statut: string): string {
    const labels: Record<string, string> = {
      for_sale: 'En vente',
      sold: 'Vendu',
      reserved: 'Réservé',
    };
    return labels[statut] || statut;
  }

  // Actions admin
  approveListing(listing: Listing) {
    console.log('Approuver annonce:', listing.id);
    listing.statut = 'for_sale';
    this.filterTable();
  }

  rejectListing(listing: Listing) {
    if (confirm(`Refuser l'annonce "${listing.title}" ?`)) {
      console.log('Refuser annonce:', listing.id);
      const index = this.listings().findIndex((l) => l.id === listing.id);
      if (index !== -1) {
        const newListings = [...this.listings()];
        newListings.splice(index, 1);
        this.listings.set(newListings);
        this.filterTable();
      }
    }
  }

  viewListing(listing: Listing) {
    console.log('Voir annonce:', listing.id);
    // this.router.navigate(['/listing', listing.id]);
  }

  banUser(user: User) {
    if (confirm(`Bannir l'utilisateur "${user.pseudo}" ?`)) {
      this.filterUsers();
    }
  }

  unbanUser(user: User) {
    if (confirm(`Réactiver l'utilisateur "${user.pseudo}" ?`)) {
      this.filterUsers();
    }
  }

  viewBook(book: Book) {
    console.log('Voir livre:', book.id);
  }

  viewAuthor(author: Author) {
    console.log('Voir auteur:', author.id);
  }

  deleteAuthor(author: Author) {
    if (confirm(`Supprimer l'auteur "${author.name}" ?`)) {
      const index = this.authors().findIndex((a) => a.id === author.id);
      if (index !== -1) {
        const newAuthors = [...this.authors()];
        newAuthors.splice(index, 1);
        this.authors.set(newAuthors);
        this.filterAuthors();
      }
    }
  }

  addCategory() {
    console.log('Ajouter une catégorie');
    // Ouvrir modal d'ajout
  }

  editCategory(category: Category) {
    console.log('Modifier catégorie:', category.id);
  }

  deleteCategory(category: Category) {
    if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
      const index = this.categories().findIndex((c) => c.id === category.id);
      if (index !== -1) {
        const newCategories = [...this.categories()];
        newCategories.splice(index, 1);
        this.categories.set(newCategories);
        this.filterCategories();
      }
    }
  }
}
