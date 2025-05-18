import { Routes } from "@angular/router";
import { ShoppingPageComponent } from "./pages/shopping-page/shopping-page.component";

export const shopingRoutes: Routes = [
  {
    path: '',
    component: ShoppingPageComponent,
    outlet: 'hijoDeRouterOulteAppHome'
  }
];
