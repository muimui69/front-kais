import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  loading = false;
  parentOptions: Category[] = [];
  existingSiblings: Category[] = [];
  parentName: string = '';

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      keywords: [''],
      level: [1, [Validators.required]],
      parentId: [null],
      isActive: [true],
      isTop: [false]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['level']) {
        this.form.patchValue({ level: Number(params['level']) });
        setTimeout(() => this.onLevelChange(), 0);
      }
      if (params['parentId']) {
        this.loadSiblings(Number(params['parentId']));
        setTimeout(() => {
          this.form.patchValue({ parentId: Number(params['parentId']) });
        }, 500);
      } else if (Number(params['level']) === 1 || this.form.get('level')?.value === 1) {
        this.loadSiblings(null);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = Number(id);
      this.loadCategoryData(this.categoryId);
    } else {
      this.onLevelChange();
    }

    this.form.get('parentId')?.valueChanges.subscribe(parentId => {
      if (parentId) {
        this.loadSiblings(parentId);
        const parent = this.parentOptions.find(p => p.id === parentId);
        this.parentName = parent ? parent.name : '';
      }
    });
  }

  onLevelChange() {
    const level = this.form.get('level')?.value;
    const parentControl = this.form.get('parentId');

    if (level === 1) {
      parentControl?.setValue(null);
      parentControl?.clearValidators();
      this.parentOptions = [];
      this.parentName = 'Categorías Principales (Raíz)';
      this.loadSiblings(null);
    } else {
      parentControl?.setValidators(Validators.required);
      this.existingSiblings = [];
      this.parentName = '';

      const targetParentLevel = level - 1;
      this.loading = true;

      if (targetParentLevel === 1) {
        this.categoryService.getLevel1().subscribe(res => {
          this.parentOptions = res.data;
          this.loading = false;
        });
      } else if (targetParentLevel === 2) {
        this.categoryService.getLevel2().subscribe(res => {
          this.parentOptions = res.data;
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }
    parentControl?.updateValueAndValidity();
  }

  loadSiblings(parentId: number | null) {
    if (parentId) {
      this.categoryService.getSubcategories(parentId).subscribe(res => {
        this.existingSiblings = res.data;
      });
    } else {
      this.categoryService.getLevel1().subscribe(res => {
        this.existingSiblings = res.data;
      });
    }
  }

  loadCategoryData(id: number) {
    this.loading = true;
    this.categoryService.getById(id, false).subscribe({
      next: (res) => {
        const cat = res.data;
        this.form.patchValue({
          name: cat.name,
          description: cat.description,
          level: cat.level,
          isActive: cat.isActive,
          isTop: cat.isTop,
          keywords: cat.keywords
        });

        if (cat.level > 1) {
           this.onLevelChange();
           setTimeout(() => {
             this.form.patchValue({ parentId: cat.parentId });
           }, 500);
        }
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/categories/category']);
      }
    });
  }

  verificionlevel3(data:any){
      if(data.level == 3){
          return true;
      }else{
          return false;
      }

  }

  save() {
    if (this.form.invalid) return;

    this.loading = true;
    let data = { ...this.form.value };

    if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords
            .split(',')
            .map((k: string) => k.trim())
            .filter((k: string) => k.length > 0)
            .join(', ');
    }

    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, data).subscribe({
        next: () => {
          this.showNotification('Actualizado correctamente', 'success');
          this.router.navigate(['/categories/category', this.categoryId]);
        },
        error: (err) => {
          this.showNotification(err.error?.message || 'Error al actualizar', 'error');
          this.loading = false;
        }
      });
    } else {
      this.categoryService.create(data).subscribe({
        next: (res) => {
          this.showNotification('Categoría creada con éxito', 'success');

         if( this.verificionlevel3(res.data)){
            this.router.navigate(['/categories/category', res.data.parent?.id]);
         }else{
            this.router.navigate(['/categories/category', res.data.id]);
         }
        },
        error: (err) => {
          this.showNotification(err.error?.message || 'Error al crear', 'error');
          this.loading = false;
        }
      });
    }
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['bg-red-500', 'text-white'] : ['bg-green-500', 'text-white']
    });
  }
}
