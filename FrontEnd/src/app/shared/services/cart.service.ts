import { Injectable } from '@angular/core';
import { ProductCart } from '@core/models/productCart.model';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { CartStorageService } from './cart-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartProducts = new BehaviorSubject<ProductCart[]>([]);
  cartProducts$ = this.cartProducts.asObservable();
  // Subject para gestionar la destrucción de la suscripción
  private destroy$ = new Subject<void>();

  constructor(private cartStorageService: CartStorageService) {
    this.cargarCarritoDesdeStorage();
    this.configurarGuardadoAutomatico();

    // Suscripción a cambios en el estado del caché para actualizar carrito si es necesario
    this.cartStorageService.getCacheEnabledObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Recargar el carrito cuando cambie el estado del caché
        this.cargarCarritoDesdeStorage();
      });
  }

  // Obtener la lista de productos en el carrito
  getCartProducts(): ProductCart[] {
    return this.cartProducts.getValue();
  }

  // Método para obtener observable del estado del caché
  get cacheEnabled$(): Observable<boolean> {
    return this.cartStorageService.getCacheEnabledObservable();
  }

  // Método para verificar si el caché está habilitado
  isCacheEnabled(): boolean {
    return this.cartStorageService.isCacheEnabled();
  }

  // Método para activar/desactivar el caché
  toggleCacheEnabled(): void {
    this.cartStorageService.toggleCacheEnabled();
  }

  cargarCarritoDesdeStorage(): void {
    // Cargar carrito desde storage service
    const storedProducts = this.cartStorageService.getCartProducts();
    if (storedProducts) {
      this.cartProducts.next(storedProducts);
    }
  }

  configurarGuardadoAutomatico(): void {
    // Suscribirse a cambios en el carrito para guardarlos automáticamente
    this.cartProducts$.pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cartStorageService.saveCartProducts(cart);
      });
  }

  // Agregar un producto al carrito
  addProduct(product: ProductCart): boolean {
    const currentCart = this.getCartProducts();
    const existingProduct = currentCart.find(p => p.itemId === product.itemId);
    if (existingProduct) {
      if (existingProduct.quantityAddedCart < existingProduct.AvailableQuantity) {
        existingProduct.quantityAddedCart += 1;
        this.cartProducts.next([...currentCart]); // Crear una nueva referencia para disparar el observable
        return true;
      }
      return false;
    } else {
      const updatedCart = [...currentCart, { ...product }];
      this.cartProducts.next(updatedCart);
      return true;
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  updateProductQuantity(product: ProductCart): void {
    const currentCart = this.getCartProducts();
    const productIndex = currentCart.findIndex(p => p.itemId === product.itemId);
    if (productIndex !== -1) {
      const updatedCart = [...currentCart];
      updatedCart[productIndex] = { ...updatedCart[productIndex], quantityAddedCart: product.quantityAddedCart };
      this.cartProducts.next(updatedCart); // Notificar cambio
    }
  }

  // Eliminar un producto del carrito
  removeProduct(product: ProductCart): void {
    const updatedCart = this.getCartProducts().filter(p => p.itemId !== product.itemId);
    this.cartProducts.next(updatedCart); // Notificar cambio
  }

  // Obtener el número total de productos en el carrito
  getTotalItems(): number {
    return this.getCartProducts().reduce((total, product) => total + product.quantityAddedCart, 0);
  }

  // Método para limpiar el carrito y el localStorage
  clearCart(): void {
    this.cartProducts.next([]); // Limpia el BehaviorSubject
    // La limpieza del storage ocurrirá automáticamente por la suscripción
  }

  ngOnDestroy(): void {
    // Completar el Subject para liberar la suscripción
    this.destroy$.next();
    this.destroy$.complete();
  }
}
