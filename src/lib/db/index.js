import { SEED_PRODUCTS, SEED_ORDERS, SEED_PROMO_CODES, SEED_USERS } from "./seedData";

// Storage keys for persistent state
const STORAGE_PREFIX = "axis_db_";

function getInitialStore(key, defaultData) {
  if (typeof window === "undefined") {
    return [...defaultData];
  }
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw) {
      return JSON.parse(raw);
    }
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(defaultData));
    return [...defaultData];
  } catch {
    return [...defaultData];
  }
}

function saveStore(key, data) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
    } catch {}
  }
}

class EntityRepository {
  constructor(name, initialData) {
    this.name = name;
    this.data = getInitialStore(name, initialData);
  }

  _reload() {
    this.data = getInitialStore(this.name, this.data);
  }

  _save() {
    saveStore(this.name, this.data);
  }

  async list(sort = "-created_date", limit = 100) {
    this._reload();
    let result = [...this.data];

    // Sorting
    if (sort) {
      const desc = sort.startsWith("-");
      const key = desc ? sort.slice(1) : sort;
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        return (valA > valB ? 1 : -1) * (desc ? -1 : 1);
      });
    }

    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    return result;
  }

  async filter(query = {}, sort = "-created_date", limit = 100) {
    this._reload();
    let result = [...this.data];

    if (query && typeof query === "object") {
      result = result.filter((item) => {
        return Object.entries(query).every(([k, v]) => {
          if (v === undefined || v === null) return true;
          // Case-insensitive string match or strict match
          if (typeof v === "string" && typeof item[k] === "string") {
            return item[k].toLowerCase() === v.toLowerCase();
          }
          return item[k] === v;
        });
      });
    }

    if (sort) {
      const desc = sort.startsWith("-");
      const key = desc ? sort.slice(1) : sort;
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        return (valA > valB ? 1 : -1) * (desc ? -1 : 1);
      });
    }

    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    return result;
  }

  async get(idOrSlug) {
    this._reload();
    return this.data.find((item) => item.id === idOrSlug || item.slug === idOrSlug) || null;
  }

  async create(payload) {
    this._reload();
    const newItem = {
      id: payload.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_date: new Date().toISOString(),
      ...payload,
    };
    this.data.unshift(newItem);
    this._save();
    return newItem;
  }

  async update(id, payload) {
    this._reload();
    const idx = this.data.findIndex((item) => item.id === id || item.slug === id);
    if (idx === -1) {
      throw new Error(`Record ${id} not found in ${this.name}`);
    }
    const updated = {
      ...this.data[idx],
      ...payload,
      updated_date: new Date().toISOString(),
    };
    this.data[idx] = updated;
    this._save();
    return updated;
  }

  async delete(id) {
    this._reload();
    this.data = this.data.filter((item) => item.id !== id && item.slug !== id);
    this._save();
    return { success: true, id };
  }
}

// Singletons for each database collection
export const productsRepo = new EntityRepository("Product", SEED_PRODUCTS);
export const ordersRepo = new EntityRepository("Order", SEED_ORDERS);
export const promosRepo = new EntityRepository("PromoCode", SEED_PROMO_CODES);
export const reviewsRepo = new EntityRepository("Review", []);
export const usersRepo = new EntityRepository("User", SEED_USERS);

// Authentication service abstraction
export const authService = {
  async me() {
    if (typeof window === "undefined") return SEED_USERS[0];
    try {
      const stored = window.localStorage.getItem("axis_current_user");
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default logged in as admin for local development convenience
    return SEED_USERS[0];
  },

  async login({ email, password }) {
    const user = (await usersRepo.filter({ email }))[0] || {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0],
      role: email.includes("admin") ? "admin" : "customer",
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem("axis_current_user", JSON.stringify(user));
      window.localStorage.setItem("axis_access_token", `token-${Date.now()}`);
    }
    return user;
  },

  async register({ email, password, name }) {
    const existing = (await usersRepo.filter({ email }))[0];
    if (existing) {
      throw new Error("User already exists with this email");
    }
    const newUser = await usersRepo.create({
      email,
      name: name || email.split("@")[0],
      role: "customer",
    });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("axis_current_user", JSON.stringify(newUser));
      window.localStorage.setItem("axis_access_token", `token-${Date.now()}`);
    }
    return newUser;
  },

  async logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("axis_current_user");
      window.localStorage.removeItem("axis_access_token");
    }
    return { success: true };
  },
};

// Database container interface
export const db = {
  entities: {
    Product: productsRepo,
    Order: ordersRepo,
    PromoCode: promosRepo,
    Review: reviewsRepo,
    User: usersRepo,
  },
  auth: authService,
  app: {
    async getPublicSettings() {
      return {
        id: "axis-store",
        public_settings: {
          store_name: "AXIS SNEAKERS",
          currency: "USD",
          support_email: "support@axis.com",
        },
      };
    },
  },
};

// Backwards-compatible alias so existing component imports work without modification
export const base44 = db;

export default db;
