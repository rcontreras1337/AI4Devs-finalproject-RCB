import { Product, Image, Item, Seller } from "@core/models/product.model";
import { Product as ProductRaw} from "@core/models/productRaw.model";
import { environment } from "src/environments/environment.development";

export const transformProductData = (response: ProductRaw, url: string): Product => {
  // console.log('transformProductData response', response);
  const productData = response; // Accede a product dentro de response

  // Verificar si items existe y tiene al menos un elemento
  const firstItem = productData.items && productData.items.length > 0 ? productData.items[0] : null;
  const hypeDiscount: number = environment.hypeDiscount;


  const genero = getSpecificationValue(productData, 'Género');
  const edad = getSpecificationValue(productData, 'Edad');
  const disciplina = getSpecificationValue(productData, 'Disciplina');
  const tipoProducto = getSpecificationValue(productData, 'Tipo de producto');
  const precio = firstItem?.sellers[0].commertialOffer.Price || 0;


  // Mapear las imágenes desde el primer item, si están disponibles
  const images: Image[] = firstItem?.images?.map(img => ({
    cacheId: img.cacheId || '',
    imageId: img.imageId || '',
    imageLabel: img.imageLabel || '',
    imageTag: img.imageTag || '',
    imageUrl: img.imageUrl || '',
    imageText: img.imageText || ''
  })) || [];

  // Mapear los items con las transformaciones requeridas
  const items: Item[] = productData.items?.map(item => ({
    itemId: item.itemId || '',
    name: item.name || '',
    nameComplete: item.nameComplete || '',
    complementName: item.complementName || '',
    ean: item.ean || '',
    sellers: mapSellers(item.sellers), // Mapea los sellers
    talla: getItemTalla(item), // Función para obtener la talla del item
    cmsTalla: convertToCms(getItemTalla(item)), // Convertir la talla a cm
    availability: item.sellers && item.sellers.length > 0
      ? item.sellers[0]?.commertialOffer?.AvailableQuantity > 0
      : false, // Verificar si hay disponibilidad
    quantityAddedCart: 0 // Inicializar en 0
  })) || [];

  // Retornar el objeto ProductCart
  return {
    productId: productData.productId || '',
    description: productData.description || '',
    productName: productData.productName || '',
    productReference: productData.productReference || '',
    linkText: productData.linkText || '',
    brand: productData.brand || '',
    brandId: productData.brandId || 0,
    link: url || '', // URL del producto en la tienda de Nike
    categories: productData.categories || [],
    categoryId: productData.categoryId || '',
    releaseDate: productData.releaseDate || '',
    titleTag: productData.titleTag || '',
    items: items,
    images: images, // Imágenes del primer item
    genero: genero,
    edad: edad as 'adulto' | 'niño',
    disciplina: disciplina,
    tipoProducto: tipoProducto,
    quantityAddedCart: 0,
    selectedSize: '',
    complementName: firstItem?.complementName || '',
    price: precio || 0,
    precioHype: hypeDiscountPrice(precio, firstItem?.complementName || '') || 0 ,
    color: getItemColor(firstItem) || 'sin color',
    urlImagen: firstItem?.images[0].imageUrl || '',
  };
};

// Función para extraer valores de specificationGroups
function getSpecificationValue(productData: ProductRaw, key: string): string {
  const group = productData.specificationGroups?.find(group =>
    group.specifications.some(spec => spec.name === key)
  );
  const specification = group?.specifications.find(spec => spec.name === key);
  return specification?.values[0] || '';
}

// Función para mapear los sellers
function mapSellers(sellers: any[]): Seller[] {
  return sellers.map(seller => ({
    sellerId: seller.sellerId || '',
    sellerName: seller.sellerName || '',
    sellerDefault: seller.sellerDefault || false,
    commertialOffer: {
      AvailableQuantity: seller.commertialOffer?.AvailableQuantity || 0,
      Price: seller.commertialOffer?.Price || 0,
      spotPrice: seller.commertialOffer?.spotPrice || 0,
      Tax: seller.commertialOffer?.Tax || 0,
      taxPercentage: seller.commertialOffer?.taxPercentage || 0
    }
  }));
}

// Función para obtener la talla del item
function getItemTalla(item: any): string {
  const variation = item.variations.find((v: any) => v.name.toLowerCase() === 'talle' || v.name.toLowerCase() === 'talla');
  return variation ? variation.values[0] : '';
}

// Función para obtener la talla del item
function getItemColor(item: any): string {
  const variation = item.variations.find((v: any) => v.name.toLowerCase() === 'color');
  return variation ? variation.values[0] : '';
}

function convertToCms(talla: string): number {
  // Aquí debes implementar la lógica específica para convertir la talla en cm
  // Por ejemplo:
  const tallaMap: { [key: string]: number } = {
    'XS': 22,
    'S': 24,
    'M': 26,
    'L': 28,
    'XL': 30
  };
  return tallaMap[talla] || 0; // Retornar 0 si la talla no está en el mapa
}

//TODO: función mejorar lógica descuento
function hypeDiscountPrice(precio: number,complementName: string): number{
  return complementName.toLocaleLowerCase().includes('calcetines') ? precio : precio * environment.hypeDiscount;
}
