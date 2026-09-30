// Shared product data helpers
export const BRANDS = ["Nike", "Adidas", "Puma", "New Balance", "Jordan", "Converse", "Vans"];
export const CATEGORIES = ["Running", "Sneakers", "Casual", "Basketball", "Formal", "Training", "Kids"];
export const ALL_SIZES = [6, 7, 8, 9, 10, 11, 12, 13];

export const COLOR_OPTIONS = [
  { name: "Black", hex: "#0E0E10" },
  { name: "White", hex: "#F7F7F5" },
  { name: "Red", hex: "#FF4B2B" },
  { name: "Blue", hex: "#1E40AF" },
  { name: "Green", hex: "#16A34A" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Beige", hex: "#D6C7A4" },
  { name: "Orange", hex: "#F97316" },
  { name: "Navy", hex: "#1E293B" },
  { name: "Pink", hex: "#EC4899" },
];

export function pctOff(price, salePrice) {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}