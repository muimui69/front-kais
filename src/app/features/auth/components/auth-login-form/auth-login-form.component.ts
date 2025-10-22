import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-login-form',
  templateUrl: './auth-login-form.component.html',
  styleUrls: ['./auth-login-form.component.css'],
  standalone: false
})
export class AuthLoginFormComponent {
  hide = signal(true);
  isLoading = signal(false);

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  public Dialog = new DialogComponent(this.dialog);

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.Dialog.openDialogError(
        'Por favor completa todos los campos correctamente',
        'Error de validación'
      );
      return;
    }

    this.isLoading.set(true);

    const { username, password } = this.loginForm.value;

    this.authService.loginPanel(username!, password!).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);

        this.Dialog.openDialogSuccess(
          `Bienvenido ${response.user.fullName}`,
          'Inicio de sesión exitoso'
        );
        this.router.navigateByUrl('/dashboard');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error en login:', err);
        const errorMessage = err.error?.message
          || 'Hubo un error al iniciar sesión. Por favor intenta nuevamente.';
        this.Dialog.openDialogError(errorMessage, 'Error de inicio de sesión');
        this.isLoading.set(false);
      }
    });
  }


}