import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import type { Product } from "@/types";

interface UseProductsOptions {
  filter?: Record<string, any>;
  sort?: string;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filterKey = JSON.stringify(options.filter || {});
  const sort = options.sort || "-created_date";
  const limit = options.limit || 100;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Product[];
      if (options.filter && Object.keys(options.filter).length > 0) {
        data = (await base44.entities.Product.filter(
          options.filter,
          sort,
          limit
        )) as Product[];
      } else {
        data = (await base44.entities.Product.list(
          sort,
          limit
        )) as Product[];
      }
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch products"));
    } finally {
      setLoading(false);
    }
  }, [filterKey, sort, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
