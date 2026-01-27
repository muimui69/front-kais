import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReferralService } from '../../services/referral.service';
import { LeaderboardEntry } from '../../interfaces/referral.interface';

@Component({
  selector: 'app-referral-leaderboard',
  standalone: false,
  templateUrl: './referral-leaderboard.component.html',
  styleUrl: './referral-leaderboard.component.css'
})
export class ReferralLeaderboardComponent implements OnInit {
  private referralService = inject(ReferralService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Estado de carga
  loading = signal(true);

  // Datos del leaderboard
  dataSource = new MatTableDataSource<LeaderboardEntry>([]);
  displayedColumns: string[] = [
    'rank',
    'professionalName',
    'code',
    'totalReferrals',
    'totalEarnings'
  ];

  // Control de límite
  limitControl = new FormControl(20);
  
  // Opciones de límite
  limitOptions = [
    { value: 10, label: 'Top 10' },
    { value: 20, label: 'Top 20' },
    { value: 50, label: 'Top 50' },
    { value: 100, label: 'Top 100' }
  ];

  ngOnInit(): void {
    this.loadLeaderboard();
    this.setupLimitControl();
  }

  /**
   * Configura el control de límite
   */
  private setupLimitControl(): void {
    this.limitControl.valueChanges.subscribe(value => {
      if (value) {
        this.loadLeaderboard(value);
      }
    });
  }

  /**
   * Carga el leaderboard
   */
  private loadLeaderboard(limit: number = 20): void {
    this.loading.set(true);

    this.referralService.getLeaderboard(limit).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Agregar ranking a cada entrada
          const dataWithRank = response.data.map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
          this.dataSource.data = dataWithRank;
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.snackBar.open('Error al cargar leaderboard', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  /**
   * Recarga el leaderboard
   */
  refresh(): void {
    this.loadLeaderboard(this.limitControl.value || 20);
    this.snackBar.open('Leaderboard actualizado', 'Ok', { duration: 2000 });
  }

  /**
   * Vuelve al dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/referrals']);
  }

  /**
   * Navega a la configuración
   */
  goToConfig(): void {
    this.router.navigate(['/referrals/config']);
  }

  /**
   * Obtiene la clase CSS para el ranking
   */
  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return '';
  }

  /**
   * Obtiene el ícono para el ranking
   */
  getRankIcon(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  }

  /**
   * Formatea las recompensas
   */
  formatRewards(amount: number): string {
    return `Bs ${amount.toLocaleString('es-BO')}`;
  }
}
