import manifestData from "../../../data/product-images.json";

// Default seed data for AXIS sneaker store
export const SEED_PROMO_CODES = [
  { id: "promo-1", code: "WELCOME10", type: "percent", value: 10, active: true },
  { id: "promo-2", code: "AXIS20", type: "percent", value: 20, active: true },
  { id: "promo-3", code: "SNEAKERVIP", type: "fixed", value: 25, active: true },
  { id: "promo-4", code: "FREESHIP", type: "fixed", value: 15, active: true },
];

const RAW_SEED_PRODUCTS = [
  {
    id: "prod-1",
    name: "Air Jordan 1 Retro High OG",
    slug: "air-jordan-1-retro-high-og",
    brand: "Jordan",
    category: "Basketball",
    gender: "Men",
    price: 180,
    sale_price: null,
    on_sale: false,
    stock: 14,
    rating: 4.9,
    review_count: 142,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    colors: [
      { name: "Chicago / Gym Red", hex: "#CE2029" },
      { name: "Black / Royal", hex: "#1E3A8A" },
      { name: "Shadow Grey", hex: "#4B5563" },
    ],
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "The sneaker that started it all. Genuine leather upper with encapsulated Air-Sole cushioning in the heel for lightweight impact protection and timeless street authority.",
    details: [
      "Full-grain leather and nubuck upper",
      "Encapsulated Air-Sole unit in heel",
      "Solid rubber outsole with deep flex grooves",
      "Perforated toe box for breathability",
    ],
    featured: true,
    best_seller: true,
    new_arrival: false,
    trending: true,
    created_date: "2026-09-01T10:00:00Z",
  },
  {
    id: "prod-2",
    name: "Nike Dunk Low Retro 'Panda'",
    slug: "nike-dunk-low-retro-panda",
    brand: "Nike",
    category: "Sneakers",
    gender: "Unisex",
    price: 115,
    sale_price: 95,
    on_sale: true,
    stock: 22,
    rating: 4.8,
    review_count: 310,
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    colors: [
      { name: "White / Black", hex: "#0E0E10" },
      { name: "Grey Fog", hex: "#9CA3AF" },
    ],
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with crisp overlays and original team colors.",
    details: [
      "Crisp synthetic and real leather upper",
      "Padded, low-cut collar for everyday comfort",
      "Foam midsole provides lightweight, responsive cushioning",
    ],
    featured: true,
    best_seller: true,
    new_arrival: false,
    trending: true,
    created_date: "2026-09-02T11:00:00Z",
  },
  {
    id: "prod-3",
    name: "New Balance 550 Vintage White",
    slug: "new-balance-550-vintage-white",
    brand: "New Balance",
    category: "Casual",
    gender: "Unisex",
    price: 120,
    sale_price: null,
    on_sale: false,
    stock: 9,
    rating: 4.7,
    review_count: 88,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    colors: [
      { name: "Sea Salt / White", hex: "#F3F4F6" },
      { name: "Vintage Green", hex: "#166534" },
      { name: "Burgundy", hex: "#831843" },
    ],
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Simple, clean, and not overdesigned. We recreated a timeless classic with this tribute to 90s pro ballers and the streetwear that defined a generation.",
    details: [
      "Premium leather and suede overlays",
      "Non-marking rubber traction outsole",
      "Adjustable lace closure for customized fit",
    ],
    featured: false,
    best_seller: false,
    new_arrival: true,
    trending: true,
    created_date: "2026-09-10T08:00:00Z",
  },
  {
    id: "prod-4",
    name: "Adidas Samba OG Core Black",
    slug: "adidas-samba-og-core-black",
    brand: "Adidas",
    category: "Casual",
    gender: "Unisex",
    price: 100,
    sale_price: 85,
    on_sale: true,
    stock: 18,
    rating: 4.8,
    review_count: 220,
    sizes: [6, 7, 8, 8.5, 9, 9.5, 10, 11, 12],
    colors: [
      { name: "Core Black / White", hex: "#111827" },
      { name: "Cloud White / Black", hex: "#FFFFFF" },
    ],
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Born on the pitch, the Samba is a timeless icon of street style. This version stays true to its legacy with a tasteful, low-profile leather upper and gum sole.",
    details: [
      "Full grain leather upper with gritty suede T-toe",
      "Soft synthetic leather lining",
      "Gum rubber midsole and outsole",
    ],
    featured: true,
    best_seller: true,
    new_arrival: false,
    trending: true,
    created_date: "2026-09-05T09:30:00Z",
  },
  {
    id: "prod-5",
    name: "Nike Air Zoom Pegasus 40",
    slug: "nike-air-zoom-pegasus-40",
    brand: "Nike",
    category: "Running",
    gender: "Men",
    price: 130,
    sale_price: null,
    on_sale: false,
    stock: 25,
    rating: 4.6,
    review_count: 94,
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    colors: [
      { name: "Obsidian / Volt", hex: "#0F172A" },
      { name: "Wolf Grey", hex: "#64748B" },
    ],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1514989940743-4ba047215c60?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "A springy ride for every run. The Peg's familiar, just-for-you feel returns to help you accomplish your running goals.",
    details: [
      "Nike React foam technology with 2 Zoom Air units",
      "Engineered single-layer mesh for inviting feel and fit",
      "Waffle-inspired outsole pattern for traction on road",
    ],
    featured: false,
    best_seller: false,
    new_arrival: true,
    trending: false,
    created_date: "2026-09-12T14:20:00Z",
  },
  {
    id: "prod-6",
    name: "Puma Suede Classic XXI",
    slug: "puma-suede-classic-xxi",
    brand: "Puma",
    category: "Sneakers",
    gender: "Unisex",
    price: 75,
    sale_price: 60,
    on_sale: true,
    stock: 12,
    rating: 4.5,
    review_count: 67,
    sizes: [7, 8, 9, 10, 11, 12],
    colors: [
      { name: "Castlerock Grey", hex: "#475569" },
      { name: "Puma Black", hex: "#18181B" },
    ],
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "With its huge impact on footwear culture, PUMA's most iconic sneaker first hit the scene in 1968 and has been worn by the icons of every generation since.",
    details: [
      "Classic low-rise silhouette",
      "Full suede upper with comfortable sockliner",
      "Rubber midsole and outsole for grip",
    ],
    featured: false,
    best_seller: false,
    new_arrival: false,
    trending: false,
    created_date: "2026-08-20T10:00:00Z",
  },
  {
    id: "prod-7",
    name: "Converse Chuck 70 Vintage High",
    slug: "converse-chuck-70-vintage-high",
    brand: "Converse",
    category: "Casual",
    gender: "Unisex",
    price: 90,
    sale_price: null,
    on_sale: false,
    stock: 30,
    rating: 4.9,
    review_count: 412,
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    colors: [
      { name: "Parchment / Egret", hex: "#E7E5E4" },
      { name: "Black Canvas", hex: "#0A0A0A" },
    ],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "By 1970, the Chuck Taylor All Star evolved into one of the best basketball sneakers, ever. The Chuck 70 celebrates that heritage with vintage details and modern comfort.",
    details: [
      "Heavyweight 12oz canvas for durability and elevated feel",
      "Winged tongue stitching helps lock it in place",
      "Archival star ankle patch and vintage license plate",
    ],
    featured: true,
    best_seller: true,
    new_arrival: false,
    trending: true,
    created_date: "2026-08-15T12:00:00Z",
  },
  {
    id: "prod-8",
    name: "Vans Old Skool Core Classic",
    slug: "vans-old-skool-core-classic",
    brand: "Vans",
    category: "Sneakers",
    gender: "Unisex",
    price: 70,
    sale_price: null,
    on_sale: false,
    stock: 16,
    rating: 4.8,
    review_count: 198,
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: [
      { name: "Black / White Side Stripe", hex: "#000000" },
      { name: "Navy Blue", hex: "#1E3A8A" },
    ],
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "First known as the Vans #36, the Old Skool debuted in 1977 with a unique new addition: a random doodle drawn by founder Paul Van Doren, originally known as the 'jazz stripe.'",
    details: [
      "Iconic low-top, sidestripe shoe",
      "Durable suede and canvas uppers",
      "Signature rubber waffle outsoles",
    ],
    featured: false,
    best_seller: true,
    new_arrival: false,
    trending: false,
  },
];

function enrichProductsWithManifest(products) {
  return products.map((p) => {
    const manifestImages = manifestData[p.slug];
    if (manifestImages && manifestImages.length > 0) {
      const localImageUrls = manifestImages.map((img) => img.src);
      const enrichedColors = (p.colors || []).map((col) => {
        const match = manifestImages.find((img) => {
          if (!img.colorName) return false;
          return (
            img.colorName.toLowerCase().includes(col.name.toLowerCase()) ||
            col.name.toLowerCase().includes(img.colorName.toLowerCase())
          );
        });
        return {
          ...col,
          image: match ? match.src : localImageUrls[0],
        };
      });

      return {
        ...p,
        images: localImageUrls,
        image: localImageUrls[0],
        imageMetadata: manifestImages,
        colors: enrichedColors,
      };
    }
    return p;
  });
}

export const SEED_PRODUCTS = enrichProductsWithManifest(RAW_SEED_PRODUCTS);

export const SEED_ORDERS = [
  {
    id: "order-101",
    order_number: "AX-88219",
    created_date: "2026-09-24T14:32:00Z",
    status: "Delivered",
    total: 295.0,
    subtotal: 280.0,
    shipping: 0.0,
    tax: 15.0,
    shipping_address: {
      name: "Marcus Taylor",
      email: "marcus.t@example.com",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      state: "OR",
      zip: "97477",
    },
    items: [
      {
        id: "prod-1",
        name: "Air Jordan 1 Retro High OG",
        price: 180.0,
        size: 10.5,
        color: "Chicago / Gym Red",
        quantity: 1,
        image: "/images/products/air-jordan-1-retro-high-og/image-1.webp",
      },
      {
        id: "prod-4",
        name: "Adidas Samba OG Core Black",
        price: 100.0,
        size: 10.5,
        color: "Core Black / White",
        quantity: 1,
        image: "/images/products/adidas-samba-og-core-black/image-1.webp",
      },
    ],
  },
  {
    id: "order-102",
    order_number: "AX-88220",
    created_date: "2026-09-28T09:15:00Z",
    status: "Processing",
    total: 124.2,
    subtotal: 115.0,
    shipping: 0.0,
    tax: 9.2,
    shipping_address: {
      name: "Sophia Chen",
      email: "sophia.chen@example.com",
      address: "1200 Grand Ave",
      city: "Seattle",
      state: "WA",
      zip: "98101",
    },
    items: [
      {
        id: "prod-2",
        name: "Nike Dunk Low Retro 'Panda'",
        price: 115.0,
        size: 8,
        color: "White / Black",
        quantity: 1,
        image: "/images/products/nike-dunk-low-retro-panda/image-1.webp",
      },
    ],
  },
];

export const SEED_USERS = [
  {
    id: "user-admin",
    email: "admin@axis.com",
    name: "AXIS Admin",
    role: "admin",
    created_date: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-customer",
    email: "customer@axis.com",
    name: "Alex Rivera",
    role: "customer",
    created_date: "2026-05-15T00:00:00Z",
  },
];
