import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { CreditService } from '../../services/credit.service';
import { UserService } from '../../../user-management/services/user.service';
import { BulkGrantCreditForm, BulkGrantResponse } from '../../interfaces/credit-stats.interface';
import { Users, searchUsersResponse } from '../../../user-management/interfaces/user.interface';

@Component({
  selector: 'app-bulk-grant',
  standalone: false,
  templateUrl: './bulk-grant.component.html',
  styleUrl: './bulk-grant.component.css'
})
export class BulkGrantComponent implements OnInit {
  private fb = inject(FormBuilder);
  private creditService = inject(CreditService);
  private userService = inject(UserService);
  private router = inject(Router);

  // Form
  bulkGrantForm!: FormGroup;

  // State signals
  loading = signal<boolean>(false);
  loadingUsers = signal<boolean>(false);
  success = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // User selection
  availableUsers = signal<Users[]>([]);
  selectedUserIds = signal<number[]>([]);
  searchQuery = signal<string>('');

  // Response data
  bulkResponse = signal<BulkGrantResponse | null>(null);

  // Source options
  sourceOptions = [
    { value: 'admin', label: 'Administrativo', icon: 'admin_panel_settings' },
    { value: 'promotion', label: 'Promoción', icon: 'local_offer' },
    { value: 'referral', label: 'Referido', icon: 'people' }
  ];

  // Min date for expiration (tomorrow)
  minExpirationDate!: string;

  // Table columns
  displayedColumns: string[] = ['select', 'userId', 'fullName', 'email'];

  ngOnInit(): void {
    this.initForm();
    this.setMinExpirationDate();
    this.loadUsers();
  }

  initForm(): void {
    this.bulkGrantForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01), Validators.max(10000)]],
      source: ['admin', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      expiresAt: ['']
    });
  }

  setMinExpirationDate(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minExpirationDate = tomorrow.toISOString().split('T')[0];
  }

  loadUsers(page: number = 1): void {
    this.loadingUsers.set(true);
    
    // Si hay búsqueda, usar el endpoint de search-user
    if (this.searchQuery() && this.searchQuery().length >= 2) {
      this.userService.searchUsers(this.searchQuery()).pipe(
        map(searchResponse => {
          // Mapear searchUsersResponse a Users
          const mappedUsers: Users[] = searchResponse.data.map((user: searchUsersResponse) => ({
            userId: user.id,
            fullName: `${user.name} ${user.lastName}`,
            userName: user.name,
            userEmail: user.email,
            userPhone: '',
            roleName: '',
            roleId: 0,
            createdAt: {},
            isActive: true,
            isVerified: true
          }));
          return { ...searchResponse, data: mappedUsers };
        })
      ).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.availableUsers.set(response.data);
          }
          this.loadingUsers.set(false);
        },
        error: (err) => {
          console.error('Error searching users:', err);
          this.error.set('Error al buscar usuarios');
          this.loadingUsers.set(false);
        }
      });
    } else {
      // Si no hay búsqueda, cargar lista normal
      const params: any = {
        page,
        limit: 100
      };

      this.userService.listUsers(params).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.availableUsers.set(response.data);
          }
          this.loadingUsers.set(false);
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error.set('Error al cargar usuarios');
          this.loadingUsers.set(false);
        }
      });
    }
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.loadUsers(1);
  }

  isSelected(userId: number): boolean {
    return this.selectedUserIds().includes(userId);
  }

  toggleUser(userId: number): void {
    const currentSelection = this.selectedUserIds();
    if (this.isSelected(userId)) {
      this.selectedUserIds.set(currentSelection.filter(id => id !== userId));
    } else {
      this.selectedUserIds.set([...currentSelection, userId]);
    }
  }

  toggleAll(): void {
    const allUserIds = this.availableUsers().map(u => u.userId);
    if (this.selectedUserIds().length === allUserIds.length) {
      this.selectedUserIds.set([]);
    } else {
      this.selectedUserIds.set(allUserIds);
    }
  }

  isAllSelected(): boolean {
    return this.availableUsers().length > 0 && 
           this.selectedUserIds().length === this.availableUsers().length;
  }

  onSubmit(): void {
    if (this.bulkGrantForm.invalid) {
      this.bulkGrantForm.markAllAsTouched();
      return;
    }

    if (this.selectedUserIds().length === 0) {
      this.error.set('Debe seleccionar al menos un usuario');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const formValue = this.bulkGrantForm.value;
    const bulkData: BulkGrantCreditForm = {
      userIds: this.selectedUserIds().map(id => id.toString()),
      amount: Number(formValue.amount),
      source: formValue.source,
      description: formValue.description,
      ...(formValue.expiresAt && { expiresAt: new Date(formValue.expiresAt).toISOString() })
    };

    this.creditService.bulkGrantCredits(bulkData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.success.set(true);
          this.bulkResponse.set(response.data);
          this.resetForm();
        } else {
          this.error.set(response.message || 'Error al otorgar créditos masivamente');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error bulk granting credits:', err);
        this.error.set(err.error?.message || 'Error al conectar con el servidor');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.bulkGrantForm.reset({
      amount: '',
      source: 'admin',
      description: '',
      expiresAt: ''
    });
    this.selectedUserIds.set([]);
  }

  goBack(): void {
    this.router.navigate(['/credits/grant']);
  }

  goToDashboard(): void {
    this.router.navigate(['/credits']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getSourceLabelFromForm(): string {
    const sourceValue = this.bulkGrantForm.get('source')?.value;
    return this.sourceOptions.find(s => s.value === sourceValue)?.label || sourceValue;
  }

  getTotalAmount(): number {
    return (this.bulkGrantForm.get('amount')?.value || 0) * this.selectedUserIds().length;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.bulkGrantForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    if (field.errors['max']) return `El valor máximo es ${field.errors['max'].max}`;
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    
    return '';
  }
}
