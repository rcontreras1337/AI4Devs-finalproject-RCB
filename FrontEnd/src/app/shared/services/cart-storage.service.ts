import { Injectable } from '@angular/core';
import { ProductCart } from '@core/models/productCart.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartStorageService {
  // Clave para la preferencia de caché
  private readonly CACHE_ENABLED_KEY = 'cartCacheEnabled';
  // Clave para los productos del carrito
  private readonly CART_PRODUCTS_KEY = 'cartProducts';

  // BehaviorSubject para el estado de habilitación del caché
  private cacheEnabled = new BehaviorSubject<boolean>(true);
  cacheEnabled$ = this.cacheEnabled.asObservable();

  // Almacenamiento de productos en memoria (para cuando el caché está desactivado)
  private currentProducts: ProductCart[] = [];

  constructor() {
    // Cargar la preferencia de caché desde localStorage al iniciar
    this.loadCachePreference();
  }

  /**
   * Carga la preferencia de caché desde localStorage
   */
  private loadCachePreference(): void {
    const storedPreference = localStorage.getItem(this.CACHE_ENABLED_KEY);
    if (storedPreference !== null) {
      this.cacheEnabled.next(storedPreference === 'true');
    }
  }

  /**
   * Obtiene el estado actual de habilitación del caché
   */
  isCacheEnabled(): boolean {
    return this.cacheEnabled.getValue();
  }

  /**
   * Obtiene un Observable del estado de habilitación del caché
   */
  getCacheEnabledObservable(): Observable<boolean> {
    return this.cacheEnabled$;
  }

  /**
   * Cambia el estado de habilitación del caché
   */
  toggleCacheEnabled(): void {
    const newState = !this.cacheEnabled.getValue();
    this.cacheEnabled.next(newState);
    // Guardar la preferencia siempre, independientemente del estado
    localStorage.setItem(this.CACHE_ENABLED_KEY, newState.toString());

    // Si se desactiva el caché, eliminar los productos guardados pero mantenerlos en memoria
    if (!newState) {
      // Antes de eliminar, guardamos una copia de los productos en memoria
      const storedCart = localStorage.getItem(this.CART_PRODUCTS_KEY);
      if (storedCart) {
        this.currentProducts = JSON.parse(storedCart);
      }
      this.removeCartProducts();
    } else {
      // Si se activa el caché y hay productos en memoria, guardarlos en localStorage
      if (this.currentProducts.length > 0) {
        localStorage.setItem(this.CART_PRODUCTS_KEY, JSON.stringify(this.currentProducts));
      }
    }
  }

  /**
   * Guarda los productos del carrito en localStorage si el caché está habilitado
   * y siempre los mantiene en memoria
   */
  saveCartProducts(products: ProductCart[]): void {
    // Siempre actualizamos la copia en memoria
    this.currentProducts = [...products];

    // Solo guardamos en localStorage si el caché está activado
    if (this.isCacheEnabled()) {
      localStorage.setItem(this.CART_PRODUCTS_KEY, JSON.stringify(products));
    }
  }

  /**
   * Obtiene los productos del carrito
   * Si el caché está activado, los obtiene de localStorage
   * Si no, los obtiene de la memoria
   */
  getCartProducts(): ProductCart[] | null {
    if (this.isCacheEnabled()) {
      const storedCart = localStorage.getItem(this.CART_PRODUCTS_KEY);
      return storedCart ? JSON.parse(storedCart) : null;
    } else {
      return this.currentProducts.length > 0 ? this.currentProducts : null;
    }
  }

  /**
   * Elimina los productos del carrito del localStorage
   */
  removeCartProducts(): void {
    localStorage.removeItem(this.CART_PRODUCTS_KEY);
  }
}
