export type ProductVariantOptions = {
  name: string;
  value: string;
};

export type Image = {
  link: string;
  alt?: string;
};

export type ProductVariant = {
  name: string;
  sku?: string;
  weight: number;
  options?: ProductVariantOptions[];
  price: number;
  image?: string;
  stockOnHand: number;
  sellerShopId: string;
};

export type Product = {
  name: string;
  description: string;
  code?: string;
  coverImage?: string;
  images?: Image[];
  variants?: ProductVariant[];
  sellerShopId: string;
};

export type ExcelObject = {
  [key: string]: any;
};
