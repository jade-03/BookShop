import { Component, inject, signal } from '@angular/core';
import { Book } from '../../../interfaces/book';
import { Category } from '../../../interfaces/category';
import { ApiService } from '../../../services/api-service';
import { forkJoin } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleBook } from '../../../interfaces/google-book';
import { StatusListing } from '../../../enums/status-listing';
import { BookCondition, OptionCondition } from '../../../enums/book-condition';

@Component({
  selector: 'app-new-book',
  imports: [ReactiveFormsModule],
  templateUrl: './new-book.html',
  styleUrl: './new-book.css',
})
export class NewBook {
  private serviceBook = inject(ApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  books = signal<Book[]>([]);
  categories = signal<Category[]>([]);
  selectBook = signal<Book | GoogleBook | null>(null);
  bookConditionOptions = OptionCondition;

  // Variables pour les fichiers
  frontCoverFile: File | null = null;
  backCoverFile: File | null = null;
  frontCoverPreview: string | null = null;
  backCoverPreview: string | null = null;

  // Variables de validation des fichiers
  frontCoverError: string | null = null;
  backCoverError: string | null = null;
  frontCoverTouched: boolean = false;
  backCoverTouched: boolean = false;

  // Ajout d'un signal pour le chargement
  isSearching = signal<boolean>(false);
  searchError = signal<string | null>(null);

  isModalOpen = true;
  selectedBookId: number | null = null;

  notify: boolean = false;
  notification = {
    message: '',
    position: '',
    icon: '',
    alertClass: '',
    duration: 2000,
  };

  listingForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    isbn: ['', [Validators.required]],
    book_condition: [BookCondition.Good, [Validators.required]],
    price: ['', [Validators.required]],
    language: ['', [Validators.required]],
    statut: [StatusListing.For_Sale, [Validators.required]],
    category: ['', [Validators.required]],
  });

  ngOnInit() {
    console.log('🚀 Composant Listing chargé !');
    forkJoin({
      book: this.serviceBook.getBooks(),
      category: this.serviceBook.getCategories(),
    }).subscribe({
      next: ({ book, category }) => {
        this.books.set(book);
        this.categories.set(category);
      },
      error: (err) => {
        console.error('❌ Erreur chargement:', err);
        this.searchError.set('Erreur lors du chargement des données');
      },
    });

    // Debug: Surveiller l'état du formulaire
    this.listingForm.statusChanges.subscribe((status) => {
      console.log('📊 Statut formulaire:', status);
      console.log('Valide:', this.listingForm.valid);
    });
  }

  onFrontCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        this.frontCoverFile = input.files[0];
        
    } else {
        console.error('❌ Aucun fichier recto sélectionné');
        this.frontCoverFile = null;
    }
}

  // ✅ Gérer la sélection du fichier verso
  onBackCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    

    this.backCoverTouched = true;
    this.backCoverError = null;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      // Validation taille
      if (file.size > maxSize) {
        this.backCoverError = 'Le fichier ne doit pas dépasser 5 Mo';
        this.backCoverFile = null;
        return;
      }

      // Validation type
      if (!allowedTypes.includes(file.type)) {
        this.backCoverError = 'Format accepté : JPG, PNG, WEBP';
        this.backCoverFile = null;
        return;
      }

      this.backCoverFile = file;
      console.log(
        '✅ Fichier verso stocké:',
        this.backCoverFile.name,
        this.backCoverFile.size,
        'bytes',
      );

      // Aperçu
      const reader = new FileReader();
      reader.onload = () => {
        this.backCoverPreview = reader.result as string;
      };
      reader.readAsDataURL(this.backCoverFile);
    } else {
      console.error('❌ Aucun fichier verso sélectionné');
      this.backCoverFile = null;
      this.backCoverPreview = null;
    }
  }

  triggerNotify(customNotify: any) {
    this.notification = {
      ...customNotify,
    };

    this.notify = true;

    setTimeout(() => {
      this.notify = false;
    }, 3000);
  }

  searchBook(isbn: string) {
    this.serviceBook.searchBookByIsbn(isbn).subscribe((response) => {
      if (response && response.isbn) {
        this.selectBook.set(response);

        // ✅ Mettre à jour le formulaire avec patchValue
        this.listingForm.patchValue({
          isbn: response.isbn,
        });
      }
    });
  }
  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.frontCoverFile) {
      this.triggerNotify({
        message: 'Veuillez sélectionner la photo recto',
        position: 'alertPosition',
        icon: 'bi bi-exclamation-triangle-fill',
        alertClass: 'alert alert-danger',
      });
      return;
    }

    if (!this.backCoverFile) {
      this.triggerNotify({
        message: 'Veuillez sélectionner la photo verso',
        position: 'alertPosition',
        icon: 'bi bi-exclamation-triangle-fill',
        alertClass: 'alert alert-danger',
      });
      return;
    }

    // ✅ Vérification du formulaire
    if (this.listingForm.invalid) {
      this.triggerNotify({
        message: 'Veuillez remplir tous les champs obligatoires',
        position: 'alertPosition',
        icon: 'bi bi-exclamation-triangle-fill',
        alertClass: 'alert alert-danger',
      });
      return;
    }

    // ✅ Vérification de la sélection du livre
    if (!this.selectBook()) {
      this.triggerNotify({
        message: "Veuillez d'abord rechercher un livre par ISBN",
        position: 'alertPosition',
        icon: 'bi bi-exclamation-triangle-fill',
        alertClass: 'alert alert-danger',
      });
      return;
    }
    const formData = new FormData();

    const listingData = {
      title: this.listingForm.get('title')?.value,
      isbn: this.listingForm.get('isbn')?.value,
      book_condition: this.listingForm.get('book_condition')?.value,
      price: Number(this.listingForm.get('price')?.value),
      language: this.listingForm.get('language')?.value,
      statut: this.listingForm.get('statut')?.value,
      category: Number(this.listingForm.get('category')?.value),
    };

    formData.append('data', JSON.stringify(listingData));
    formData.append('frontCover', this.frontCoverFile);
    formData.append('backCover', this.backCoverFile);

    // 🔍 Vérification finale du FormData
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`  ${key}: ${value.name} (${value.size} bytes, type: ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    // Envoi
    this.serviceBook.postListing(formData).subscribe({
      next: (response) => {
        console.log('✅ Succès:', response);
        this.triggerNotify({
          message: 'Votre annonce crée avec succès',
          position: 'alertPosition',
          icon: 'bi bi-check-circle-fill',
          alertClass: 'alert alert-success',
        });
        setTimeout(() => {
          this.closeModalAndRedirect();
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Erreur détaillée:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        console.error('Error body:', err.error);
        this.triggerNotify({
          message: 'Erreur: ' + (err.error?.message || err.message || 'Erreur lors de la création'),
          position: 'alertPosition',
          icon: 'bi bi-exclamation-triangle-fill',
          alertClass: 'alert alert-danger',
        });
      },
    });
  }

  getBookTitle(book: Book | GoogleBook | null): string {
    return book?.title || 'Titre inconnu';
  }

  getBookAuthor(book: Book | GoogleBook | null): string {
    if (!book) return 'Auteur inconnu';

    const anyBook = book as any;
    const author = anyBook?.author?.name ?? anyBook?.author ?? anyBook?.authors;

    if (!author) {
      return 'Auteur inconnu';
    }

    if (Array.isArray(author)) {
      return author.join(', ');
    }

    return author;
  }

  getAuthorName(author: any): string {
    if (!author) return 'Auteur inconnu';
    if (Array.isArray(author.name)) return author.name.join(', ');
    if (typeof author.name === 'string') return author.name;
    return 'Auteur inconnu';
  }

  private closeModalAndRedirect() {
    this.isModalOpen = false;
    this.router.navigate(['/catalogue']);
  }

  testFileSelected(event: Event): void {
    console.log('🔔 testFileSelected appelé !!!');
    const input = event.target as HTMLInputElement;
    console.log('Fichiers:', input.files);
    if (input.files && input.files[0]) {
        alert('Fichier sélectionné: ' + input.files[0].name);
    }
}
//   private serviceBook = inject(ApiService);
//   private fb = inject(FormBuilder);
//   private router = inject(Router);

//   books = signal<Book[]>([]);
//   categories = signal<Category[]>([]);
//   selectBook = signal<Book | GoogleBook | null>(null);

//   Book_Condition = BookCondition;
//   bookConditionOptions = OptionCondition;

//   frontCoverFile: File | null = null;
//   backCoverFile: File | null = null;
//   frontCoverPreview: string | null = null;
//   backCoverPreview: string | null = null;

//   // Ajout d'un signal pour le chargement
//   isSearching = signal<boolean>(false);
//   searchError = signal<string | null>(null);
//   // Pour la validation des images
// frontCoverError: string | null = null;
// frontCoverTouched = false;
// backCoverError: string | null = null;
// backCoverTouched = false;




// // Méthode pour vérifier si le formulaire est valide
// isFormValid(): boolean {
//   return this.listingForm.valid && 
//          !this.frontCoverError && this.frontCoverFile !== null &&
//          !this.backCoverError && this.backCoverFile !== null;
// }

//   isModalOpen = true;

//   notify: boolean = false;
//   notification = {
//     message: '',
//     position: '',
//     icon: '',
//     alertClass: '',
//     duration: 2000,
//   };

//   triggerNotify(customNotify: any) {
//     this.notification = {
//       ...customNotify,
//     };

//     this.notify = true;

//     setTimeout(() => {
//       this.notify = false;
//     }, 3000);
//   }

//   listingForm: FormGroup = this.fb.group({
//     title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
//     isbn: ['', [Validators.required]],
//     book_condition: [BookCondition.Good, [Validators.required]],
//     price: ['', [Validators.required]],
//     language: ['', [Validators.required]],
//     statut: [StatusListing.For_Sale, [Validators.required]],
//     category: [''],
//   });

//   ngOnInit() {
//     forkJoin({
//       book: this.serviceBook.getBooks(),
//       category: this.serviceBook.getCategories(),
//     }).subscribe({
//       next: ({ book, category }) => {
//         this.books.set(book);
//         this.categories.set(category);
//         this.triggerNotify({
//           message: 'Livre créer avec succès',
//           position: 'alertPosition',
//           icon: 'bi bi-check-circle-fill',
//           alertClass: 'alert alert-success',
//         });
//       },
//       error: (err) => {
//         console.error('❌ Erreur chargement:', err);
//         this.searchError.set('Erreur lors du chargement des données');
//       },
//     });
//   }
//   onSubmit(event: Event) {
//     event.preventDefault();
//     const formData = new FormData()

//     formData.append(
//       'data',
//       JSON.stringify({
//         title: this.listingForm.controls['title'].value,
//       isbn: this.listingForm.controls['isbn'].value,
//       book_condition: this.listingForm.controls['book_condition'].value,
//       price: this.listingForm.controls['price'].value,
//       language: this.listingForm.controls['language'].value,
//       statut: this.listingForm.controls['statut'].value,
//       category: Number(this.listingForm.controls['category'].value),
      
//       })
//     )
    

//     this.serviceBook.postListing(formData).subscribe({
//       next: () => {
//         this.triggerNotify({
//           message: 'Votre annonce créer avec succès',
//           position: 'alertPosition',
//           icon: 'bi bi-check-circle-fill',
//           alertClass: 'alert alert-success',
//         });
//         setTimeout(() => {
//           this.closeModalAndRedirect();
//         }, 2000);
//       },
//       error(err) {
//         alert('Error -' + err.error);
//         console.log('ERREUR:' + err);
//       },
//     });
//   }

//   searchBook(isbn: string) {
//     this.serviceBook.searchBookByIsbn(isbn).subscribe((response) => {
//       if (response && response.isbn) {
//         this.selectBook.set(response);

//         // ✅ Mettre à jour le formulaire avec patchValue
//         this.listingForm.patchValue({
//           isbn: response.isbn,
//         });
//       }
//     });
//   }

//   getBookTitle(book: Book | GoogleBook | null): string {
//     return book?.title || 'Titre inconnu';
//   }

//   getBookAuthor(book: Book | GoogleBook | null): string {
//     if (!book) return '';

//     const anyBook = book as any;

//     // Essaie différents chemins possibles pour l'auteur
//     const author =
//       anyBook?.author?.name ?? // Ton format actuel
//       anyBook?.author ?? // String simple
//       anyBook?.authors; // Tableau d'auteurs

//     if (!author) {
//       return 'Auteur inconnu';
//     }

//     // Si c'est un tableau, joint les noms
//     if (Array.isArray(author)) {
//       return author.join(', ');
//     }

//     // Si c'est une string, retourne directement
//     return author;
//   }

//   onFrontCoverSelected(event: Event): void {
//   this.frontCoverTouched = true;
//   const input = event.target as HTMLInputElement;
  
//   if (input.files && input.files[0]) {
//     const file = input.files[0];
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
//     if (!allowedTypes.includes(file.type)) {
//       this.frontCoverError = 'Format non supporté. Utilisez JPG, PNG ou WEBP';
//       this.frontCoverFile = null;
//       this.frontCoverPreview = null;
//       return;
//     }
    
//     if (file.size > maxSize) {
//       this.frontCoverError = 'L\'image ne doit pas dépasser 5MB';
//       this.frontCoverFile = null;
//       this.frontCoverPreview = null;
//       return;
//     }
    
//     this.frontCoverError = null;
//     this.frontCoverFile = file;
    
//     // Aperçu
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.frontCoverPreview = reader.result as string;
//     };
//     reader.readAsDataURL(file);
//   } else {
//     this.frontCoverError = 'La photo recto est requise';
//     this.frontCoverFile = null;
//     this.frontCoverPreview = null;
//   }
// }

// // ✅ Gérer la sélection du fichier verso
// onBackCoverSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files[0]) {
//         this.backCoverFile = input.files[0];
        
//         // Aperçu
//         const reader = new FileReader();
//         reader.onload = () => {
//             this.backCoverPreview = reader.result as string;
//         };
//         reader.readAsDataURL(this.backCoverFile);
//     }
//   }

//   getAuthorName(author: any): string {
//     if (!author) return 'Auteur inconnu';
//     if (Array.isArray(author.name)) return author.name.join(', ');
//     if (typeof author.name === 'string') return author.name;
//     return 'Auteur inconnu';
//   }

//   private closeModalAndRedirect() {
//     this.isModalOpen = false;
//     this.router.navigate(['/catalogue']);
//   }
}
