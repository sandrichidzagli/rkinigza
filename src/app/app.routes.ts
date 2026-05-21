import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'trains',
    canActivate: [authGuard],
    loadComponent: () => import('./trains/trains.component').then(m => m.TrainsComponent)
  },
  {
    path: 'booking',
    canActivate: [authGuard],
    loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'tickets',
    canActivate: [authGuard],
    loadComponent: () => import('./tickets/tickets.component').then(m => m.TicketsComponent)
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent)
  },
  { path: '**', redirectTo: '' }
];
