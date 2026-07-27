import type {
  AvailabilityStatus,
  ReturnPolicy,
  ShippingInformation,
  WarrantyInformation,
} from "./attributes";
import type { ProductCategorySlug } from "./category";
import type { ProductReview } from "./review";

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: ProductCategorySlug;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: WarrantyInformation;
  shippingInformation: ShippingInformation;
  availabilityStatus: AvailabilityStatus;
  reviews: ProductReview[];
  returnPolicy: ReturnPolicy;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

export type ProductField = keyof Product;

export type ProductSelection<TField extends ProductField> = Pick<
  Product,
  TField | "id"
>;

export type ProductSummaryField =
  | "title"
  | "price"
  | "thumbnail"
  | "brand"
  | "rating"
  | "discountPercentage"
  | "availabilityStatus"
  | "category";

export type ProductSummary = ProductSelection<ProductSummaryField>;

export type CartableProduct = Pick<
  Product,
  "id" | "title" | "price" | "thumbnail" | "availabilityStatus"
>;
