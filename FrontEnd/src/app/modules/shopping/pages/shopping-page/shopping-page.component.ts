import { Component, inject, ViewChild } from '@angular/core';
import { ProductCardComponent } from "../../../../shared/components/product-card/product-card.component";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShoppingService } from '@modules/shopping/services/shoping.service';
import { CurrencyPipe, NgFor, NgIf, NgStyle} from '@angular/common';
import { Product } from '@core/models/product.model';
import { transformProductData } from '@core/utils/dataMapToProduct';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ModalCardProductComponent } from '@shared/components/modal-card-product/modal-card-product.component';
import { CartSummary, ProductCart } from '@core/models/productCart.model';
import { CartService } from '@shared/services/cart.service';
import { environment } from 'src/environments/environment.development';
import { PdfGeneratorService } from '@shared/services/pdf-generator.service';

@Component({
  selector: 'app-shopping-page',
  standalone: true,
  imports: [ProductCardComponent, FormsModule, NgFor, ModalCardProductComponent, NgIf, NgStyle, CurrencyPipe],
  templateUrl: './shopping-page.component.html',
  styleUrl: './shopping-page.component.css'
})
export class ShoppingPageComponent {

  // Env intereses Variables
  TASA_COBRO = environment.comisionPorCobro;
  TASA_CUOTAS = environment.comisionPor6Cuotas;
  IVA = environment.iva;

  urlInput: string = '';
  totalPrice: number = 0;
  private toast = inject(ToastrService);
  private shoppingService = inject(ShoppingService);
  private pdfService = inject(PdfGeneratorService);
  cartService = inject(CartService); // Inyectar el servicio del carrito
  selectedProduct: Product | null = null;

  // Lista de productos en el carrito
  products: Array<Product> = [];
  cartProductsList: Array<ProductCart> = [];

  // Obtén una referencia al componente hijo
  @ViewChild(ModalCardProductComponent) modalComponent!: ModalCardProductComponent;

  // Propiedades para la animación de vuelo
  animateFly = false;
  flyAnimationStyle: any = {};

  // Crear el Subject para gestionar la destrucción
  private destroy$ = new Subject<void>();

  //Sumario de totales
  cartSummary: CartSummary = {
    totalAmount: 0,
    totalAmountCredit: 0,
    shippingCost: 0,
    totalSaved: 0,
    totalOriginalPrice: 0,
  };

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.addProduct('https://www.nike.cl/fq2027-643-nikecourt-slam/p');
    this.sincronizarDatosCarrito();
    this.calculateCartSummary();
  }

  // Método para calcular interés de 6 cuotas\
  calculateInterest(total: number): number {
    // Factor total de comisiones con IVA
    const factorCobroCuotas = (this.TASA_COBRO * (1 + this.IVA)) + (this.TASA_CUOTAS * (1 + this.IVA));
    // Monto total a cobrar
    const totalACobrar = Math.round(total / (1 - factorCobroCuotas));
    return totalACobrar;
  }
  // Método para calcular el resumen del carrito
  calculateCartSummary(): void {
    let total = 0;
    let totalOriginalPrice = 0;
    let saved = 0;
    let totalCredit = 0;

    this.cartProductsList.forEach(product => {
      total += product.precioHype * product.quantityAddedCart;
      totalOriginalPrice += product.price * product.quantityAddedCart; // Calcular el precio original
      saved += (product.price - product.precioHype) * product.quantityAddedCart; // Calcular ahorro
    });

    const shippingCost = total < 50000 ? 5000 : 0; // Costo de envío: 5000 pesos si el total es menor a 50,000
    total += shippingCost;
    totalCredit = this.calculateInterest(total); // Total a crédito en 6 cuotas
    this.cartSummary = { totalAmount: total, totalAmountCredit: totalCredit, totalOriginalPrice, shippingCost, totalSaved: saved };
  }

  sincronizarDatosCarrito(): void{
    this.cartService.cartProducts$.pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.cartProductsList = products; // Sincroniza la lista local con la del servicio
    });
  }

  // Método para abrir el modal desde el componente padre
  openProductModal(): void {
    this.modalComponent.openModal();
  }


  //TODO: validar
  onProductAdded(event: ProductCart): void {
    if (!this.cartService.addProduct(event)) {
      this.toast.warning('Sin más stock', 'HypeV4ault');
    } else {
      this.toast.success('Producto agregado!', 'HypeV4ult'); // Mostramos el mensaje de éxito
      this.startFlyAnimation(event.urlImagen);
      this.calculateCartSummary();
    }
  }

  // Función para agregar el enlace de Nike
  addProduct(url:string): void {
    if (url) {
      this.shoppingService.getProductData(url).subscribe(
        (data) => {
          this.selectedProduct = data;
          this.openProductModal();
        },
        (error) => {
          console.error('Error al obtener los datos del producto', error);
          this.toast.error('Error al obtener los datos del producto', 'Error'); // Mensaje de error si el campo está vacío
        }
      );
      this.urlInput = '';  // Limpiar el input después de agregar
    } else {
      this.toast.error('Por favor, ingrese una URL válida', 'Error'); // Mensaje de error si el campo está vacío
    }
  }


  // Método para eliminar un producto del carrito
  removeProduct(product: ProductCart): void {
    this.cartService.removeProduct(product); // Llamar al servicio para eliminar el producto
    this.calculateCartSummary();
  }

  // Método para actualizar la cantidad de un producto
  updateProductQuantity(updatedProduct: ProductCart): void {
    this.cartService.updateProductQuantity(updatedProduct); // Llamar al servicio para actualizar la cantidad
    this.calculateCartSummary();
  }


  // Animación del producto hacia el carrito
  startFlyAnimation(imageUrl: string): void {
    const cartIcon = document.getElementById('cart-icon');
    if (!cartIcon) return;

    // Posición inicial de la animación
    this.flyAnimationStyle = {
      position: 'fixed',
      top: '50%', // Posición relativa a la pantalla
      left: '50%',
      width: '80px',
      zIndex: 1000,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      transition: 'all 1s ease-out'
    };

    this.animateFly = true;

    setTimeout(() => {
      // Posición de destino de la animación (hacia el ícono del carrito)
      const cartIconRect = cartIcon.getBoundingClientRect();
      this.flyAnimationStyle = {
        ...this.flyAnimationStyle,
        top: `${cartIconRect.top}px`,
        left: `${cartIconRect.left}px`,
        width: '30px',
        height: '30px',
      };
    }, 10); // Esperar un momento antes de mover

    // Detener la animación después de completar el vuelo
    setTimeout(() => {
      this.animateFly = false;
    }, 1100);
  }

  // Método para destruir las suscripciones y liberar recursos
  ngOnDestroy(): void {
    // Emitir un valor para destruir todas las suscripciones con takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para descargar el resumen del pedido en PDF
  downloadPDF(): void {
    this.pdfService.generateShoppingPDF(this.cartProductsList, this.cartSummary);
  }
}
