import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent)},
  { path: 'main', loadComponent: () => import('./main/main').then(m => m.MainComponent)},
];

