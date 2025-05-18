import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@shared/services/cart.service';
import { Subject, takeUntil } from 'rxjs';
//import { CartService } from '@core/services/cart.service'; // Importar el servicio del carrito

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = false;
  userMenuOpen = false;
  cartItemCount = 0;
  cacheEnabled = true; // Estado del caché

  private router = inject(Router);
  private cartService = inject(CartService); // Inyectar el servicio del carrito
  // Subject para gestionar la destrucción de suscripciones
  private destroy$ = new Subject<void>();
  user = {
    name: 'Ruben Contreras',
    avatar: 'https://via.placeholder.com/150',
  };

  constructor() { }

  ngOnInit(): void {
    this.suscribirseAlCarrito();
    this.suscribirseAlEstadoCache();
  }

  suscribirseAlCarrito(): void {
    this.cartService.cartProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.cartItemCount = this.cartService.getTotalItems(); // Actualizar la cantidad del carrito
      });
  }

  suscribirseAlEstadoCache(): void {
    this.cartService.cacheEnabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe(enabled => {
        this.cacheEnabled = enabled;
      });
  }

  toggleCacheEnabled(): void {
    this.cartService.toggleCacheEnabled();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToContacto() {
    this.router.navigate(['/contacto']);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    console.log('Cerrando sesión');
  }

  goToCart(): void {
    this.router.navigate(['/shopping']);
  }

  ngOnDestroy(): void {
    // Emitir un valor para destruir todas las suscripciones con takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }
}
