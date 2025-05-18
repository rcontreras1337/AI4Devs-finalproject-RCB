import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '@core/models/product.model';
import { ProductCart } from '@core/models/productCart.model';
import { ToastrService } from 'ngx-toastr';

// Definir un tipo extendido para manejar la cantidad y la talla seleccionada
interface CartProduct extends Product {
  quantity: number;
  selectedSize: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [FormsModule, NgIf, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'] // Cambié styleUrl a styleUrls (plural)
})
export class ProductCardComponent {
  @Input() product!: ProductCart; // Usamos el tipo extendido CartProduct
  @Output() removeProduct = new EventEmitter<ProductCart>();
  @Output() updateQuantity = new EventEmitter<ProductCart>();
  private toast = inject(ToastrService);

  // Inicializamos quantity en 1 si no se ha definido antes
  ngOnInit() {
    if (!this.product.quantityAddedCart) {
      this.product.quantityAddedCart = 1; // Inicializa la cantidad en 1 si no está definida
    }


  }

  // Función para seleccionar una talla
  selectSize(size: string): void {
    this.product.selectedSize = size; // Guardamos la talla seleccionada
  }


  // Método para actualizar la cantidad
  onQuantityChange() {
    if (this.product.quantityAddedCart > this.product.AvailableQuantity) {
      this.product.quantityAddedCart = this.product.AvailableQuantity;
      this.toast.warning('Sin más stock', 'HypeV4ault');
      return;
    }
    if (this.product.quantityAddedCart < 1) {
      this.product.quantityAddedCart = 1; // Evitar cantidades menores a 1
    }
    this.updateQuantity.emit(this.product); // Emitir el producto actualizado
  }

  // Método para eliminar un producto
  onRemove() {
    this.removeProduct.emit(this.product);
  }
}
