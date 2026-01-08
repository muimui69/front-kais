import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Bitacora } from '../../interface/bitacora.interface';
import { BitacoraService } from '../../services/bitacora.service';

@Component({
  selector: 'app-bitacora-browser',
  standalone: false,
  templateUrl: './bitacora-browser.component.html',
  styleUrl: './bitacora-browser.component.css'
})
export class BitacoraBrowserComponent implements OnInit {
  private bitacoraService = inject(BitacoraService);
  private fb = inject(FormBuilder);

  displayedColumns: string[] = ['id', 'action', 'user', 'description', 'date'];

  dataSource: Bitacora[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      action: [''],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadLogs();

    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadLogs();
      });
  }

  loadLogs() {
    this.loading = true;
    const filters = this.filterForm.value;

    const cleanFilters = {
        ...filters,
        startDate: filters.startDate ? filters.startDate.toISOString() : null,
        endDate: filters.endDate ? filters.endDate.toISOString() : null
    };

    this.bitacoraService.getAll(this.pageIndex + 1, this.pageSize, cleanFilters)
      .subscribe({
        next: (res) => {
          this.dataSource = res.data;
          this.totalItems = res.total;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLogs();
  }
}
