import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const authRoutes: Routes = [ //TODO: generar inicio sesion y guardado de rutas
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
