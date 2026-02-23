import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { CreditService } from '../../services/credit.service';
import { UserService } from '../../../user-management/services/user.service';
import { GrantCreditForm, GrantCreditResponse } from '../../interfaces/credit-stats.interface';
import { searchUsersResponse, Users } from '../../../user-management/interfaces/user.interface';

@Component({
  selector: 'app-grant-credits',
  standalone: false,
  templateUrl: './grant-credits.component.html',
  styleUrl: './grant-credits.component.css'
})
export class GrantCreditsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private creditService = inject(CreditService);
  private userService = inject(UserService);
  private router = inject(Router);

  // Form
  grantForm!: FormGroup;

  // State signals
  loading = signal<boolean>(false);
  searchingUsers = signal<boolean>(false);
  success = signal<boolean>(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // User search
  userSearchResults = signal<searchUsersResponse[]>([]);
  selectedUser = signal<searchUsersResponse | null>(null);
  userSearchQuery = signal<string>('');

  // Response data
  grantedTransaction = signal<GrantCreditResponse | null>(null);

  // Source options
  sourceOptions = [
    { value: 'admin', label: 'Administrativo', icon: 'admin_panel_settings' },
    { value: 'promotion', label: 'Promoción', icon: 'local_offer' },
    { value: 'refund', label: 'Reembolso', icon: 'replay' },
    { value: 'referral', label: 'Referido', icon: 'people' }
  ];

  // Min date for expiration (tomorrow)
  minExpirationDate!: string;

  ngOnInit(): void {
    this.initForm();
    this.setupUserSearch();
    this.setMinExpirationDate();
  }

  initForm(): void {
    this.grantForm = this.fb.group({
      userId: ['', [Validators.required]],
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

  setupUserSearch(): void {
    this.grantForm.get('userId')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (query && query.length >= 2 && typeof query === 'string') {
            this.searchingUsers.set(true);
            this.userSearchQuery.set(query);
            return this.userService.searchUsers(query);
          } else {
            this.userSearchResults.set([]);
            return of(null);
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (response?.success && response.data) {
            this.userSearchResults.set(response.data);
          } else {
            this.userSearchResults.set([]);
          }
          this.searchingUsers.set(false);
        },
        error: (err) => {
          console.error('Error searching users:', err);
          this.userSearchResults.set([]);
          this.searchingUsers.set(false);
        }
      });
  }

  onUserSelected(user: searchUsersResponse): void {
    this.selectedUser.set(user);
    this.grantForm.patchValue({ userId: user.id.toString() });
    this.userSearchResults.set([]);
  }

  clearUserSelection(): void {
    this.selectedUser.set(null);
    this.grantForm.patchValue({ userId: '' });
  }

  getUserDisplay(user: searchUsersResponse): string {
    return `${user.name} (${user.email})`;
  }

  onSubmit(): void {
    if (this.grantForm.invalid) {
      this.grantForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const formValue = this.grantForm.value;
    const grantData: GrantCreditForm = {
      userId: formValue.userId.toString(),
      amount: Number(formValue.amount),
      source: formValue.source,
      description: formValue.description,
      ...(formValue.expiresAt && { expiresAt: new Date(formValue.expiresAt).toISOString() })
    };

    this.creditService.grantCreditsForm(grantData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.success.set(true);
          this.grantedTransaction.set(response.data);
          this.successMessage.set(`¡Créditos otorgados exitosamente! Nuevo balance: ${this.formatCurrency(response.data.newBalance)} Bs`);
          this.resetForm();
        } else {
          this.error.set(response.message || 'Error al otorgar créditos');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error granting credits:', err);
        this.error.set(err.error?.message || 'Error al conectar con el servidor');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.grantForm.reset({
      userId: '',
      amount: '',
      source: 'admin',
      description: '',
      expiresAt: ''
    });
    this.selectedUser.set(null);
    this.userSearchResults.set([]);
  }

  goBack(): void {
    this.router.navigate(['/credits']);
  }

  goToBulkGrant(): void {
    this.router.navigate(['/credits/bulk-grant']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getSourceLabel(sourceValue: string): string {
    return this.sourceOptions.find(s => s.value === sourceValue)?.label || sourceValue;
  }

  getSourceLabelFromForm(): string {
    const sourceValue = this.grantForm.get('source')?.value;
    return this.getSourceLabel(sourceValue);
  }

  hasExpirationDate(): boolean {
    return !!this.grantForm.get('expiresAt')?.value;
  }

  getExpirationDateValue(): string {
    return this.grantForm.get('expiresAt')?.value || '';
  }

  formatSource(source: string): string {
    const labels: Record<string, string> = {
      'admin': 'Administrativo',
      'promotion': 'Promoción',
      'refund': 'Reembolso',
      'referral': 'Referido'
    };
    return labels[source] || source;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.grantForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    if (field.errors['max']) return `El valor máximo es ${field.errors['max'].max}`;
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;

    return '';
  }
}
