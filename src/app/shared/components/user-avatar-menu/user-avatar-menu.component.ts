import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/interfaces/auth.inteface';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'shared-user-avatar-menu',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './user-avatar-menu.component.html',
  styleUrl: './user-avatar-menu.component.css'
})
export class UserAvatarMenuComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public user = signal<User | null>(null);

  ngOnInit(): void {
    this.user.set(this.authService.getCurrentUser());
  }

  getAvatarColor(user: User | null): string {
    if (!user) return '#9CA3AF';

    const hash = user.fullName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const colors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
      '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'
    ];

    return colors[Math.abs(hash) % colors.length];
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  logout(): void {
    this.authService.logout();
  }
}