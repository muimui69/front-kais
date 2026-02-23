import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-category-details',
  standalone: false,
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  category: Category | null = null;
  loading = true;
  keywordsList: string[] = [];
  readonly environment = environment;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCategory(Number(id));
    } else {
      this.returnBack();
    }
  }

  loadCategory(id: number) {
    this.loading = true;
    this.categoryService.getById(id, true).subscribe({
      next: (res) => {
        this.category = res.data;
        this.processKeywords(this.category.keywords);
        this.loading = false;
      },
      error: () => {
        this.showNotification('Error al cargar la categoría', 'error');
        this.returnBack();
      }
    });
  }

  processKeywords(keywords?: string) {
    if (!keywords) {
      this.keywordsList = [];
      return;
    }
    this.keywordsList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }

  onEdit() {
    if (this.category) {
      this.router.navigate(['/categories/category/edit', this.category.id]);
    }
  }

  returnBack() {
    if (this.category?.parentId) {
      this.router.navigate(['/categories/category', this.category.parentId]);
    } else {
      this.router.navigate(['/categories/category']);
    }
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['bg-red-500', 'text-white'] : undefined
    });
  }
}
