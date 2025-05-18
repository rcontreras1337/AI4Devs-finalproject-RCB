import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, LOCALE_ID, Output } from '@angular/core';
import { Item, Product, Seller } from '@core/models/product.model';
import { ProductCart } from '@core/models/productCart.model';
declare var bootstrap: any;

@Component({
  selector: 'app-modal-card-product',
  standalone: true,
  imports: [CurrencyPipe,NgFor],
  templateUrl: './modal-card-product.component.html',
  styleUrl: './modal-card-product.component.scss'
})
export class ModalCardProductComponent {

  @Input() product: Product | null = null;
  @Output() productAdded = new EventEmitter<ProductCart>();
  selectedSize: Item | null = null;

  // Método para obtener las tallas disponibles
  getAvailableSizes(): any[] {
    return this.product?.items.filter((item: any) => item.availability) || [];
  }

  // Método público para abrir el modal
  public openModal(): void {
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  selectSize(item: Item): void {
    this.selectedSize = item;
    this.productAdded.emit({
      categoryId: this.product?.categoryId || '',
      color: this.product?.color || '',
      complementName: item.complementName,
      description: this.product?.description || '',
      disciplina: this.product?.disciplina || '',
      genero: this.product?.genero || '',
      itemId: item.itemId || '',
      link: this.product?.link || '',
      nameComplete: item.nameComplete,
      precioHype: this.product?.precioHype || 0,
      price: this.product?.price || 0,
      productId: this.product?.productId || '',
      productName: this.product?.productName || '',
      productReference: this.product?.productReference || '',
      quantityAddedCart: 1,
      releaseDate: this.product?.releaseDate || '',
      selectedSize: item.talla,
      tipoProducto: this.product?.tipoProducto || '',
      urlImagen: this.product?.urlImagen || '',
      AvailableQuantity: this.getTotalAvailableQuantity(item),
    });
  }

  getTotalAvailableQuantity(item: Item): number {
    return item.sellers.reduce((total: number, seller: Seller) => {
      return total + (seller.commertialOffer?.AvailableQuantity || 0);
    },
    // Indica en la cantidad que inicia total
    0);
  }

  // Método para animar el botón de talla
  animateButton(event: any): void {
    const button = event.target;
    button.classList.add('animate-pop');

    setTimeout(() => {
      button.classList.remove('animate-pop');
    }, 300); // Duración de la animación en milisegundos
  }
}
