import { HttpClient } from '@angular/common/http';
import {Injectable } from "@angular/core";
import { AdminContext } from '../../auth/interfaces/auth.inteface';


@Injectable({
    providedIn: 'root'
})
export class StorageService{

  private readonly APP_ADMIN_USER= 'APP_ADMIN_USER';

  constructor(){}


  saveAdminToLocalStorage(admin: AdminContext): void{
    try {
      localStorage.setItem(this.APP_ADMIN_USER, JSON.stringify(admin));
    } catch (error) {
      console.error('Error saving admin to localStorage', error);
    }
  }

  getAdminFromLocalStorage(): AdminContext | null {
    const adminJson = localStorage.getItem(this.APP_ADMIN_USER);
    if (adminJson) {
      try {
        return JSON.parse(adminJson) as AdminContext;
      } catch (error) {
        console.error('Error parsing admin from localStorage', error);
        return null;
      }
    }
    return null;
  }

  clearAll(): void{
    localStorage.clear();
  }




}
