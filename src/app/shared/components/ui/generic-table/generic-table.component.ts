import { Component, Input, Output, EventEmitter, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableAction, TableColumn } from '../../../interfaces/generic-table.interface';

@Component({
  selector: 'shared-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatMenuModule
  ],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent<T = any> {
  @Input() set data(value: T[]) {
    this.dataSource.set(value || []);
    this.filteredData.set(value || []);
    this.totalItems.set((value || []).length);
  }

  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() isLoading = signal(false);
  @Input() showSearch = true;
  @Input() showPagination = true;
  @Input() showSelection = false;
  @Input() actionsInMenu = true;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50, 100];
  @Input() searchPlaceholder = 'Buscar...';
  @Input() noDataMessage = 'No se encontraron registros';
  @Input() searchFields: string[] = [];
  @Input() title?: string;
  @Input() enableRowClick = true;

  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  public dataSource = signal<T[]>([]);
  public filteredData = signal<T[]>([]);
  public totalItems = signal(0);
  public pageIndex = signal(0);
  public currentPageSize = signal(this.pageSize);
  public searchTerm = signal('');

  public selection = new SelectionModel<T>(true, []);

  constructor() {
    effect(() => {
      if (this.showSelection) {
        this.selectionChange.emit(this.selection.selected);
      }
    });
  }

  public displayedColumns = computed(() => {
    const cols = this.columns.map(col => col.key);
    if (this.showSelection) {
      cols.unshift('select');
    }
    if (this.actions.length > 0) {
      cols.push('actions');
    }
    return cols;
  });

  public paginatedData = computed(() => {
    const data = this.filteredData();
    if (!this.showPagination) {
      return data;
    }
    const startIndex = this.pageIndex() * this.currentPageSize();
    const endIndex = startIndex + this.currentPageSize();
    return data.slice(startIndex, endIndex);
  });

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchTerm.set(filterValue);

    if (!filterValue) {
      this.filteredData.set(this.dataSource());
      this.totalItems.set(this.dataSource().length);
      this.pageIndex.set(0);
      return;
    }

    const fieldsToSearch = this.searchFields.length > 0
      ? this.searchFields
      : this.columns.map(col => col.key);

    const filtered = this.dataSource().filter(item =>
      fieldsToSearch.some(field => {
        const value = this.getNestedValue(item, field);
        return value?.toString().toLowerCase().includes(filterValue);
      })
    );

    this.filteredData.set(filtered);
    this.totalItems.set(filtered.length);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
    this.pageChange.emit(event);
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.filteredData.set(this.dataSource());
      this.sortChange.emit(sort);
      return;
    }

    const data = this.filteredData().slice();
    const sortedData = data.sort((a, b) => {
      const valueA = this.getNestedValue(a, sort.active);
      const valueB = this.getNestedValue(b, sort.active);
      const isAsc = sort.direction === 'asc';
      return this.compare(valueA, valueB, isAsc);
    });

    this.filteredData.set(sortedData);
    this.sortChange.emit(sort);
  }

  private compare(a: any, b: any, isAsc: boolean): number {
    if (a === null || a === undefined) return isAsc ? 1 : -1;
    if (b === null || b === undefined) return isAsc ? -1 : 1;
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  getBadgeColor(column: TableColumn, value: any): { bg: string; text: string } {
    if (column.badgeConfig?.colorMap?.[value]) {
      return column.badgeConfig.colorMap[value];
    }
    return column.badgeConfig?.defaultColor || { bg: '#e0e0e0', text: '#000000' };
  }

  onRowClick(row: T): void {
    if (this.enableRowClick) {
      this.rowClick.emit(row);
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.paginatedData().length;
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.paginatedData());
    }
    this.selectionChange.emit(this.selection.selected);
  }

  toggleRow(row: T): void {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  shouldShowAction(action: TableAction, row: T): boolean {
    return action.condition ? action.condition(row) : true;
  }

  getVisibleActions(row: T): TableAction[] {
    return this.actions.filter(action => this.shouldShowAction(action, row));
  }

  clearSelection(): void {
    this.selection.clear();
    this.selectionChange.emit([]);
  }

  getSelectedRows(): T[] {
    return this.selection.selected;
  }
}