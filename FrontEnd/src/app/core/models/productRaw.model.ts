export interface Product {
  advertisement: any;
  cacheId: string;
  productId: string;
  description: string;
  productName: string;
  productReference: string;
  linkText: string;
  brand: string;
  brandId: number;
  link: string;
  categories: string[];
  categoryId: string;
  releaseDate: string;
  priceRange: PriceRange;
  specificationGroups: SpecificationGroup[];
  skuSpecifications: SkuSpecification[];
  productClusters: ProductCluster[];
  clusterHighlights: any[];
  properties: Property[];
  titleTag: string;
  metaTagDescription: string;
  items: Item[];
  itemMetadata: any;
}

export interface PriceRange {
  sellingPrice: Price;
  listPrice: Price;
  __typename: string;
}

export interface Price {
  highPrice: number;
  lowPrice: number;
  __typename: string;
}

export interface SpecificationGroup {
  name: string;
  originalName: string;
  specifications: Specification[];
}

export interface Specification {
  name: string;
  originalName: string;
  values: string[];
}

export interface SkuSpecification {
  field: SpecificationField;
  values: SpecificationValue[];
}

export interface SpecificationField {
  name: string;
  originalName: string;
}

export interface SpecificationValue {
  name: string;
  originalName: string;
}

export interface ProductCluster {
  id: string;
  name: string;
}

export interface Property {
  name: string;
  values: string[];
}

export interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  variations: Property[];
  referenceId: Reference[];
  measurementUnit: string;
  unitMultiplier: number;
  images: Image[];
  videos: any[];
  sellers: Seller[];
  kitItems: any[];
  attachments: any[];
  estimatedDateArrival: any;
}

export interface Reference {
  Key: string;
  Value: string;
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
  addToCartLink: string;
  commertialOffer: CommertialOffer;
}

export interface CommertialOffer {
  discountHighlights: any[];
  teasers: any[];
  Price: number;
  ListPrice: number;
  Tax: number;
  taxPercentage: number;
  spotPrice: number;
  PriceWithoutDiscount: number;
  RewardValue: number;
  PriceValidUntil: string;
  AvailableQuantity: number;
  CacheVersionUsedToCallCheckout: string;
  Installments: Installment[];
}

export interface Installment {
  Value: number;
  InterestRate: number;
  TotalValuePlusInterestRate: number;
  NumberOfInstallments: number;
  Name: string;
  PaymentSystemName: string;
}
