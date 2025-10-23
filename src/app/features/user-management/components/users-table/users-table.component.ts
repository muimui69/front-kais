import { Component, OnInit, signal, inject } from '@angular/core';
import { TableAction, TableColumn } from '../../../../shared/interfaces/generic-table.interface';
import { FormatService } from '../../../../shared/services/localstorage/format.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  salary: number;
  performance: number;
  createdAt: Date;
}

interface FormattedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  salary: string;
  performance: string;
  createdAt: string;
}

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  standalone: false
})
export class UsersTableComponent implements OnInit {
  private readonly format = inject(FormatService);

  public isLoading = signal(false);
  public formattedUsers = signal<FormattedUser[]>([]);

  public columns: TableColumn[] = [
    {
      key: 'id',
      header: 'ID',
      type: 'number',
      width: '80px',
      sortable: true
    },
    {
      key: 'name',
      header: 'Nombre',
      type: 'text',
      sortable: true
    },
    {
      key: 'email',
      header: 'Email',
      type: 'text',
      sortable: true
    },
    {
      key: 'salary',
      header: 'Salario',
      type: 'text',
      align: 'right',
      sortable: true
    },
    {
      key: 'performance',
      header: 'Rendimiento',
      type: 'text',
      align: 'center',
      sortable: true
    },
    {
      key: 'role',
      header: 'Rol',
      type: 'badge',
      sortable: true,
      badgeConfig: {
        colorMap: {
          'Admin': { bg: '#725a1f', text: '#f4d13f' },
          'User': { bg: '#5c6c71', text: '#ffffff' },
          'Moderator': { bg: '#242b35', text: '#bec8cc' }
        }
      }
    },
    {
      key: 'status',
      header: 'Estado',
      type: 'badge',
      badgeConfig: {
        colorMap: {
          'active': { bg: '#d4edda', text: '#155724' },
          'inactive': { bg: '#f8d7da', text: '#721c24' }
        }
      }
    },
    {
      key: 'createdAt',
      header: 'Fecha de Registro',
      type: 'text'
    }
  ];

  public actions: TableAction[] = [
    {
      icon: 'visibility',
      label: 'Ver detalles',
      color: '#5c6c71',
      action: (row) => this.onView(row)
    },
    {
      icon: 'edit',
      label: 'Editar',
      color: '#f4d13f',
      action: (row) => this.onEdit(row)
    },
    {
      icon: 'delete',
      label: 'Eliminar',
      color: '#ef4444',
      condition: (row) => row.role !== 'Admin',
      action: (row) => this.onDelete(row)
    }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);

    setTimeout(() => {
      const userData: User[] = [
        {
          id: 1,
          name: 'Juan Pérez',
          email: 'juan@example.com',
          role: 'Admin',
          status: 'active',
          salary: 5500.50,
          performance: 95.75,
          createdAt: new Date('2024-01-15T10:30:00')
        },
        {
          id: 2,
          name: 'María García',
          email: 'maria@example.com',
          role: 'User',
          status: 'active',
          salary: 3200.00,
          performance: 87.25,
          createdAt: new Date('2024-02-20T14:15:00')
        },
        {
          id: 3,
          name: 'Carlos López',
          email: 'carlos@example.com',
          role: 'User',
          status: 'inactive',
          salary: 2800.75,
          performance: 62.50,
          createdAt: new Date('2024-03-10T09:45:00')
        },
        {
          id: 4,
          name: 'Ana Martínez',
          email: 'ana@example.com',
          role: 'Moderator',
          status: 'active',
          salary: 4100.25,
          performance: 91.00,
          createdAt: new Date('2024-04-05T16:20:00')
        }
      ];

      const formatted: FormattedUser[] = userData.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        salary: this.format.currency(user.salary),
        performance: this.format.percent(user.performance),
        createdAt: this.format.date(user.createdAt, 'dd/MM/yyyy HH:mm')
      }));

      this.formattedUsers.set(formatted);
      this.isLoading.set(false);
    }, 1000);
  }

  onRowClick(user: FormattedUser): void {
    console.log('👆 Click en fila:', user);
  }

  onSelectionChange(selected: FormattedUser[]): void {
    console.log('✅ Usuarios seleccionados:', selected);
  }

  onView(user: FormattedUser): void {
    console.log('👁️ Ver:', user);
  }

  onEdit(user: FormattedUser): void {
    console.log('✏️ Editar:', user);
  }

  onDelete(user: FormattedUser): void {
    console.log('🗑️ Eliminar:', user);
  }
}