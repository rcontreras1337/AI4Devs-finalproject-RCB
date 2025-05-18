export interface Product{
  productId: string;
  description: string;
  productName: string;
  productReference: string;
  linkText: string;
  brand: string;
  brandId: number;
  link: string; // editarlo y colocar el de la url de Nike
  categories: string[];
  categoryId: string;
  releaseDate: string;
  titleTag: string;
  items: Item[]; //tiene que ir si o si, quizás este se debe mapear distinto
  images: Image[]; // Rellenar afuera para no repetirlas, sacarlas del primer ITEM
  genero: string; // se saca de productRaw de specificationGroups, la llave Género y se saca el value
  edad: 'adulto' | 'niño'; // Sacar esta info del data raw
  disciplina: string; // se saca de productRaw de specificationGroups, la llave Disciplina y se saca el value
  tipoProducto: string; //se saca de productRaw de specificationGroups, la llave Tipo de producto y se saca el value
  quantityAddedCart: number;
  selectedSize: string;
  complementName: string;
  price: number;
  color: string;
  urlImagen: string;
  precioHype: number;
}

export interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  sellers: Seller[];
  talla: string;
  cmsTalla: number; // Transformar la talla de la zapatilla a csm de acuerdo a su categorización
  availability: boolean;
  quantityAddedCart: number; // inicializar en 0
}

export interface Image {
  cacheId: string;
  imageId: string;
  imageLabel: string;
  imageTag: string;
  imageUrl: string;
  imageText: string;
}

export interface Seller {
  sellerId: string;
  sellerName: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

export interface CommertialOffer {
  AvailableQuantity: number; // Importante porque de esta manera se sabra si hay unidades disponibles
  Price: number;
  spotPrice: number;
  Tax: number;
  taxPercentage: number;
}







