import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject, switchMap, map } from 'rxjs';
import { UserService } from '../../../user-management/services/user.service';
import { CreditService } from '../../services/credit.service';
import { Users, searchUsersResponse } from '../../../user-management/interfaces/user.interface';
import { CreditBalance } from '../../interfaces/credit.interface';

interface UserWithCredit extends Users {
  creditBalance?: number;
  loadingBalance?: boolean;
}

@Component({
  selector: 'app-user-search',
  standalone: false,
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent implements OnInit {
  private userService = inject(UserService);
  private creditService = inject(CreditService);
  private router = inject(Router);

  // State signals
  searchQuery = signal<string>('');
  users = signal<UserWithCredit[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);

  // Search subject for debouncing
  private searchSubject = new Subject<string>();

  // Table columns
  displayedColumns: string[] = ['userId', 'fullName', 'email', 'balance', 'actions'];

  ngOnInit(): void {
    this.setupSearch();
    this.loadUsers();
  }

  setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        switchMap((query) => {
          this.loading.set(true);
          // Usar el endpoint de búsqueda de administradores
          if (query && query.length >= 2) {
            return this.userService.searchUsers(query).pipe(
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

                return {
                  success: searchResponse.success,
                  message: searchResponse.message,
                  data: mappedUsers,
                  pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: mappedUsers.length,
                    itemsPerPage: mappedUsers.length,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    nextPage: null,
                    previousPage: null
                  }
                };
              })
            );
          } else {
            return this.userService.listUsers({ page: 1, limit: 20 });
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.users.set(response.data.map(user => ({ ...user, loadingBalance: true })));
            this.currentPage.set(response.pagination.currentPage);
            this.totalPages.set(response.pagination.totalPages);
            this.totalItems.set(response.pagination.totalItems);
            this.loadBalances();
          } else {
            this.error.set(response.message || 'Error al buscar usuarios');
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error searching users:', err);
          this.error.set('Error al conectar con el servidor');
          this.loading.set(false);
        }
      });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  loadUsers(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    // Si hay búsqueda, usar endpoint de search-user
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

          return {
            success: searchResponse.success,
            message: searchResponse.message,
            data: mappedUsers,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: mappedUsers.length,
              itemsPerPage: mappedUsers.length,
              hasNextPage: false,
              hasPreviousPage: false,
              nextPage: null,
              previousPage: null
            }
          };
        })
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.users.set(response.data.map(user => ({ ...user, loadingBalance: true })));
            this.currentPage.set(response.pagination.currentPage);
            this.totalPages.set(response.pagination.totalPages);
            this.totalItems.set(response.pagination.totalItems);
            this.loadBalances();
          } else {
            this.error.set(response.message || 'Error al cargar usuarios');
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error searching users:', err);
          this.error.set('Error al conectar con el servidor');
          this.loading.set(false);
        }
      });
    } else {
      // Si no hay búsqueda, usar listado normal
      const params = {
        page,
        limit: 20
      };

      this.userService.listUsers(params).subscribe({
        next: (response) => {
          if (response.success) {
            this.users.set(response.data.map(user => ({ ...user, loadingBalance: true })));
            this.currentPage.set(response.pagination.currentPage);
            this.totalPages.set(response.pagination.totalPages);
            this.totalItems.set(response.pagination.totalItems);
            this.loadBalances();
          } else {
            this.error.set(response.message || 'Error al cargar usuarios');
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error.set('Error al conectar con el servidor');
          this.loading.set(false);
        }
      });
    }
  }

  loadBalances(): void {
    const userIds = this.users().map(u => u.userId);
    if (userIds.length === 0) return;

    this.creditService.getMultipleBalances(userIds).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const balanceMap = new Map<number, number>();
          response.data.forEach((balance: CreditBalance) => {
            balanceMap.set(balance.userId, balance.balance);
          });

          this.users.update(users =>
            users.map(user => ({
              ...user,
              creditBalance: balanceMap.get(user.userId) ?? 0,
              loadingBalance: false
            }))
          );
        }
      },
      error: (err) => {
        console.error('Error loading balances:', err);
        this.users.update(users =>
          users.map(user => ({
            ...user,
            creditBalance: 0,
            loadingBalance: false
          }))
        );
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadUsers(page);
  }

  viewUserDetail(userId: number): void {
    this.router.navigate(['/credits/users', userId]);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.loadUsers(1);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}
