import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; // <--- Importante
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs'; // <--- RxJS operators necesarios
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'; // <--- Para el evento de selección
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-browser',
  standalone: false,
  templateUrl: './category-browser.component.html',
  styleUrl: './category-browser.component.css'
})
export class CategoryBrowserComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // --- Variables existentes ---
  categories: Category[] = [];
  loading = false;
  currentParent: Category | null = null;
  readonly MAX_LEVEL = 3;

  // --- NUEVAS Variables para el Buscador ---
  searchControl = new FormControl('');
  searchResults$: Observable<Category[]> | undefined;

  ngOnInit() {
    // 1. Lógica existente de carga de categorías
    this.route.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        this.categories = [];
        const parentId = params.get('parentId');

        if (parentId) {
          const id = Number(parentId);
          this.loadParentInfo(id);
          return this.categoryService.getSubcategories(id);
        } else {
          this.currentParent = null;
          return this.categoryService.getLevel1();
        }
      })
    ).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.showNotification('Error al cargar las categorías', 'error');
        this.loading = false;
      }
    });

    // 2. NUEVA Lógica del Buscador (Autocomplete)
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400), // Espera 400ms a que el usuario termine de escribir
      distinctUntilChanged(),
      switchMap(term => {
        // Si el término es un objeto (cuando ya seleccionó) o es muy corto, no buscamos
        if (!term || typeof term !== 'string' || term.length < 2) {
          return of([]);
        }
        // Llamamos al servicio de búsqueda
        return this.categoryService.search(term, false).pipe(
          map(response => response.data || []),
          catchError(err => {
            console.error(err);
            return of([]);
          })
        );
      })
    );
  }

  // --- Métodos existentes ---

  private loadParentInfo(id: number) {
    this.categoryService.getById(id, false).subscribe({
      next: (res) => this.currentParent = res.data,
      error: () => this.showNotification('No se pudo cargar la info del padre', 'error')
    });
  }

  onCategoryClick(category: Category) {
    if (category.level >= this.MAX_LEVEL) {
      this.showNotification(`Has llegado al último nivel: ${category.name}`, 'info');
      return;
    }
    this.router.navigate(['/categories/category', category.id]);
  }

  goBack() {
    if (this.currentParent && this.currentParent.parentId) {
      this.router.navigate(['/categories/category', this.currentParent.parentId]);
    } else {
      this.router.navigate(['/categories/category']);
    }
  }

  getCategoryColor(level: number): string {
    switch (level) {
      case 1: return 'indigo';
      case 2: return 'emerald';
      case 3: return 'amber';
      default: return 'slate';
    }
  }

  onViewDetails(category: Category) {
    this.router.navigate(['/categories/category/view', category.id]);
  }

  onEdit(category: Category) {
    this.router.navigate(['/categories/category/edit', category.id]);
  }

  onCreateNew() {
    if (this.currentParent) {
       this.router.navigate(['/categories/category/create'], {
         queryParams: {
           parentId: this.currentParent.id,
           level: this.currentParent.level + 1
         }
       });
    } else {
       this.router.navigate(['/categories/category/create']);
    }
  }

  onDelete(category: Category) {
    if (confirm(`¿Estás seguro de eliminar "${category.name}"?`)) {
      this.loading = true;

      this.categoryService.delete(category.id).subscribe({
        next: () => {
          this.showNotification('Categoría eliminada correctamente', 'success');
          this.refreshCurrentView();
        },
        error: (err) => {
          console.error(err);
          this.showNotification('No se pudo eliminar. Verifica si tiene subcategorías activas.', 'error');
          this.loading = false;
        }
      });
    }
  }

  private refreshCurrentView() {
    const currentId = this.route.snapshot.paramMap.get('parentId');
    if (currentId) {
      this.categoryService.getSubcategories(Number(currentId)).subscribe(res => {
        this.categories = res.data;
        this.loading = false;
      });
    } else {
      this.categoryService.getLevel1().subscribe(res => {
        this.categories = res.data;
        this.loading = false;
      });
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: type === 'error' ? ['bg-red-500', 'text-white'] : undefined
    });
  }

  // --- NUEVOS MÉTODOS PARA EL BUSCADOR ---

  // Se ejecuta cuando el usuario selecciona una opción del autocomplete
  onSearchResultSelected(event: MatAutocompleteSelectedEvent): void {
    const category: Category = event.option.value;

    // Navegar a la vista de detalle
    this.onViewDetails(category);

    // Opcional: Limpiar el buscador después de seleccionar
    this.searchControl.setValue('');
  }

  // Ayuda a mostrar el nombre en el input si se selecciona con flechas (opcional)
  displayFn(category: Category): string {
    return category && category.name ? category.name : '';
  }
}
