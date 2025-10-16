import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { LocalStorageService } from '../../../../shared/services/localstorage/localstorage.service';

@Component({
  selector: 'auth-login-form',
  templateUrl: './auth-login-form.component.html',
  styleUrls: ['./auth-login-form.component.css'],
  standalone: false
})
export class AuthLoginFormComponent {

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // private authService = inject(AuthService)
  private local = inject(LocalStorageService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)
  private dialog = inject(MatDialog)
  public isLoading = false
  public Dialog = new DialogComponent(this.dialog)
  loginForm = this.formBuilder.group({
    // username: ['', [Validators.required, Validators.minLength(2)], []],
    // pass: ['', [Validators.required, Validators.minLength(2)], []],
    username: [''],
    pass: [''],
  });

  onLogin() {
    this.isLoading = true
    const { username, pass } = this.loginForm.value
    const user = username as string
    const password = pass as string
    // const loginForm: LoginInterface = {
    //   usercode: user, password
    // }

    // console.log({ loginForm })

    this.router.navigateByUrl('/dashboard');

    this.isLoading = false;


    // this.authService.login(loginForm)
    //   .subscribe({
    //     next: (res) => {
    //       console.log({ res })
    //       this.local.setItem<LoginResponse>('user', res);
    //       this.router.navigateByUrl('/dashboard');
    //       this.isLoading = false;
    //     },
    //     error: (err) => {
    //       console.log({ err })
    //       if (err.error.mensaje) {
    //         this.Dialog.openDialogError(`${err.error.mensaje}`, 'Inicio de Sesion')
    //       } else {
    //         this.Dialog.openDialogError(`Hubo un error al iniciar la sesion`, 'Inicio de Sesion')
    //       }
    //       this.isLoading = false
    //     }
    //   })


  }


}
