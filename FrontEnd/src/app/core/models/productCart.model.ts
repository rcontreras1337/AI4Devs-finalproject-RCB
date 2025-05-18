export interface ProductCart {
  categoryId: string;
  color: string;
  complementName: string;
  description: string;
  disciplina: string;
  genero: string;
  itemId: string;
  link: string;
  nameComplete: string;
  precioHype: number;
  price: number;
  productId: string;
  productName: string;
  productReference: string;
  quantityAddedCart: number;
  releaseDate: string;
  selectedSize: string
  tipoProducto: string;
  urlImagen: string;
  AvailableQuantity: number;
  urlOriginal?: string; // URL original del producto en Nike
}

export interface CartSummary {
  totalAmount: number; // Total de la compra
  totalAmountCredit: number; // Total de la compra a crédito
  shippingCost: number; // Costo de envío
  totalSaved: number; // Total ahorrado
  totalOriginalPrice: number; // Precio original total sin descuento
}


