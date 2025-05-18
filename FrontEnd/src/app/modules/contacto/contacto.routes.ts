import { Routes } from "@angular/router";
import { ContactPageComponent } from "./pages/contact-page/contact-page.component";

export const contactoRoutes: Routes = [
  {
    path: '',
    component: ContactPageComponent,
    outlet: 'hijoDeRouterOulteAppHome'
  }
];
