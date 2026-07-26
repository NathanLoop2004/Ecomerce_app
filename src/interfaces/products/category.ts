export type ProductCategorySlug =
  | "beauty"
  | "fragrances"
  | "furniture"
  | "groceries"
  | "home-decoration"
  | "kitchen-accessories"
  | "laptops"
  | "mens-shirts"
  | "mens-shoes"
  | "mens-watches"
  | "mobile-accessories"
  | "motorcycle"
  | "skin-care"
  | "smartphones"
  | "sports-accessories"
  | "sunglasses"
  | "tablets"
  | "tops"
  | "vehicle"
  | "womens-bags"
  | "womens-dresses"
  | "womens-jewellery"
  | "womens-shoes"
  | "womens-watches";

export interface ProductCategory {
  slug: ProductCategorySlug;
  name: string;
  url: string;
}
