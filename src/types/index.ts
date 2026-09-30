export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  gender: "Men" | "Women" | "Kids" | "Unisex";
  price: number;
  sale_price?: number | null;
  on_sale?: boolean;
  stock?: number;
  rating?: number;
  review_count?: number;
  colors?: ProductColor[];
  sizes?: number[];
  images?: string[];
  image?: string;
  description?: string;
  details?: string[];
  best_seller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  featured?: boolean;
  created_date?: string;
}

export interface CartItem {
  key: string;
  product_id: string;
  name: string;
  brand: string;
  image?: string;
  price: number;
  original_price?: number;
  size: number | string;
  color?: string;
  quantity: number;
  slug?: string;
}

export interface PromoCode {
  id?: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active?: boolean;
}

export interface Address {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface OrderItem {
  product_id?: string;
  name: string;
  brand?: string;
  image?: string;
  price: number;
  quantity: number;
  size?: number | string;
  color?: string;
}

export interface Order {
  id: string;
  order_number: string;
  created_date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  items: OrderItem[];
  shipping_address?: Address;
  payment_method?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: "admin" | "customer";
  created_date?: string;
}

export interface StoreSettings {
  store_name: string;
  contact_email: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  tax_rate: number;
}
