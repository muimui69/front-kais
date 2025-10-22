import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
// import { LoginResponse } from '../../../auth/interface/loginResponse.interface';
// import { LocalStorageService } from '../../../shared/services/localstorage.service';
// import { Role } from '../../../shared/roles/role.enum';
// import { MaterialModule } from '../../../material/material.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { menuItem } from '../../../shared/menuItem/menuItem';
// import { ThemeService } from '../../../theme.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LocalStorageService } from '../../shared/services/localstorage/localstorage.service';
import { MaterialModule } from '../../shared/material.module';
import { menuItem } from '../../shared/menuItem/menuItem';
import { Menu } from '../../shared/enums/menu-enum/menu-Enum';
import { AuthService } from '../../features/auth/services/auth.service';
// import { LoginResponse } from '../../../auth/interface/loginResponse.interface';
// import { ThemeToggleComponent } from "../../../shared/services/theme/theme-toggle.component";
@Component({
  selector: 'app-navbar-layout',
  standalone: true,
  templateUrl: './navbar-layout.component.html',
  styleUrl: './navbar-layout.component.css',
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    MatSlideToggleModule,
    // ThemeToggleComponent
  ],
})
export class NavbarLayoutComponent {
  showFiller = false;
  mobileQuery: MediaQueryList;
  readonly panelOpenState = signal(false);
  public fillerNav = menuItem;
  private _mobileQueryListener: () => void;
  // public user?: LoginResponse;
  private local = inject(LocalStorageService);
  private authService = inject(AuthService);
  // public roles = Role;
  public menu = Menu;

  // private themeService = inject(ThemeService)
  public isDarkTheme!: boolean



  ngOnInit(): void {
    // this.setIsDarkTheme()
    if (isPlatformBrowser(this.platformId)) {
      // this.setUser()
      // console.log({ user: this.user })
    }
  }

  // setIsDarkTheme() {

  //   const isDarkLocal = this.local.getItem<boolean>('theme');

  //   if (isDarkLocal !== null) {
  //     this.isDarkTheme = isDarkLocal;

  //     if (this.isDarkTheme) {
  //       const themeUrl = 'assets/themes/magenta-violet.css';
  //       this.themeService.setTheme(themeUrl);
  //     } else {
  //       const themeUrl = 'assets/themes/rose-red.css';
  //       this.themeService.setTheme(themeUrl);
  //     }
  //   } else {

  //     this.isDarkTheme = false;
  //     const themeUrl = 'assets/themes/rose-red.css';
  //     this.themeService.setTheme(themeUrl);
  //   }
  // }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

  }
  onclick() {
    console.log("Click")
  }
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  onLogout(): void {
    this.authService.logout();

  }

  isActive(route: string): boolean {
    // Para rutas exactas y también soporta rutas hijas activas
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  // private setUser() {
  //   // const userLocal = this.local.getItem<LoginResponse>('user')
  //   // if (userLocal) {
  //   //   this.user = userLocal
  //   // }
  // }

  // public tieneAcceso(rolesPermitidos: Role[]): boolean {
  //   // if (!this.user?.rol) {
  //   //   return false;
  //   // }
  //   // return this.user.rol.some(r => rolesPermitidos.includes(r.NAMEROLE as Role));
  // }

  // public roleAccess(role: Role[]): boolean {
  //   // if (!this.user?.rol) {
  //   //   return false;
  //   // }
  //   // const roles = this.user.rol;
  //   // for (let i = 0; i < roles.length; i++) {
  //   //   if (role.includes(roles[i].NAMEROLE as Role)) return true;
  //   // }

  //   // return false;
  // }

  // public toggleChange() {
  //   this.isDarkTheme = !this.isDarkTheme;
  //   if (this.isDarkTheme) {
  //     // this.mode = 'Modo Noche';
  //     const themeUrl = 'assets/themes/magenta-violet.css';
  //     this.themeService.setTheme(themeUrl);
  //   } else {
  //     // this.mode = 'Modo Día';
  //     const themeUrl = 'assets/themes/rose-red.css';
  //     this.themeService.setTheme(themeUrl);
  //   }
  //   this.local.setItem<boolean>('theme', this.isDarkTheme);
  // }
}