import { Routes } from '@angular/router';



export const homeRoutes: Routes = [
  {
    path: 'shopping',
    loadChildren: () => import('@modules/shopping/shopping.routes').then(m => m.shopingRoutes)
  },
  {
    path: 'contacto',
    loadChildren: () => import('@modules/contacto/contacto.routes').then(m => m.contactoRoutes)
  },
  {
    path: '**',
    redirectTo: '/shopping',
    pathMatch: 'full'
  }
];
