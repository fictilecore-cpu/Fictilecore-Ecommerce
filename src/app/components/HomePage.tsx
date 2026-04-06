'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ProductCard from '@/app/components/ProductCard';
import ProductFilters from '@/app/components/ProductFilters';
import { motion } from 'framer-motion';
import { FilterOptions, Product } from '@/app/types';
import Navbar from './Navbar';
import Footer1 from './Footer1';
import { useSearchParams, useRouter } from 'next/navigation';

// ────────────────────────────────────────────────
//  Custom debounce (no external dependencies)
// ────────────────────────────────────────────────
function debounce<T extends (...args: any[]) => any>(fn: T, delay = 500) {
  let timer: NodeJS.Timeout | undefined;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = undefined;
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
}

function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    priceRange: [0, Infinity],
    minRating: 0,
    sortBy: 'featured',
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );

  const observer = useRef<IntersectionObserver | null>(null);

  // ────────────────────────────────────────────────
  //  FETCH NORMAL PAGINATED PRODUCTS
  // ────────────────────────────────────────────────
  const fetchProducts = useCallback(
    async (pageNumber: number) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await fetch(
          `https://fictilecore.com/api/products/page?page=${pageNumber}&size=4`
        );

        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();

        if (data.content && Array.isArray(data.content) && data.content.length > 0) {
          setProducts((prev) => [...prev, ...data.content]);
          setPage(pageNumber);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // ────────────────────────────────────────────────
  //  FETCH SEARCH RESULTS
  // ────────────────────────────────────────────────
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setProducts([]); // clear previous results

    try {
      const res = await fetch(
        `https://fictilecore.com/api/search?query=${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error(`Search failed: ${res.status}`);

      const data = await res.json();

      let results: Product[] = [];

      // Try to handle the most common API response shapes
      if (Array.isArray(data)) {
        results = data;
      } else if (data?.content && Array.isArray(data.content)) {
        results = data.content;
      } else if (data?.results && Array.isArray(data.results)) {
        results = data.results;
      } else if (data?.products && Array.isArray(data.products)) {
        results = data.products;
      } else if (data?.data && Array.isArray(data.data)) {
        results = data.data;
      }

      setProducts(results);
      setHasMore(false); // most search endpoints don't support pagination
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ────────────────────────────────────────────────
  //  DEBOUNCED SEARCH
  // ────────────────────────────────────────────────
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        // Reset state when clearing search
        if (query.trim().length === 0) {
          setProducts([]);
          setPage(0);
          setHasMore(true);
          fetchProducts(0);
          router.replace('/', { scroll: false });
          return;
        }

        // Perform search
        fetchSearchResults(query);
        router.replace(`/?search=${encodeURIComponent(query)}`, {
          scroll: false,
        });
      }, 500),
    [fetchProducts, fetchSearchResults, router]
  );

  // ────────────────────────────────────────────────
  //  INITIAL LOAD + URL PARAM SYNC
  // ────────────────────────────────────────────────
  useEffect(() => {
    const queryFromUrl = searchParams.get('search') || '';
    setSearchQuery(queryFromUrl);

    // Cancel any pending debounced calls before new action
    debouncedSearch.cancel();

    if (queryFromUrl.trim()) {
      debouncedSearch(queryFromUrl);
    } else {
      setProducts([]);
      setPage(0);
      setHasMore(true);
      fetchProducts(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // ────────────────────────────────────────────────
  //  INFINITE SCROLL OBSERVER (disabled during search)
  // ────────────────────────────────────────────────
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || searchQuery.trim() !== '') return;
      if (!hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchProducts(page + 1);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchProducts, searchQuery]
  );

  // ────────────────────────────────────────────────
  //  FILTERING + SORTING
  // ────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (filters.category !== 'all' && product.category !== filters.category)
        return false;
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      )
        return false;
      if (product.rating < filters.minRating) return false;
      return true;
    });

    switch (filters.sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            productsCount={filteredProducts.length}
          />

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <p className="text-gray-600 font-medium">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? 's' : ''} found
                {searchQuery && (
                  <span className="text-gray-500"> for "{searchQuery}"</span>
                )}
              </p>
            </div>

            {/* PRODUCT GRID */}
            <div
              className={`
                grid gap-5
                grid-cols-${gridView ? '2' : '1'}
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
              `}
            >
              {filteredProducts.map((product, index) => {
                const isLast = index === filteredProducts.length - 1;
                const shouldObserve =
                  !searchQuery.trim() && isLast && hasMore && !loading;

                if (shouldObserve) {
                  return (
                    <div ref={lastProductRef} key={product.id}>
                      <ProductCard product={product} index={index} />
                    </div>
                  );
                }

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Loading / Empty / End states */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                {searchQuery.trim()
                  ? `No products found for "${searchQuery}"`
                  : 'No products available at the moment'}
              </div>
            )}

            {!loading && !hasMore && !searchQuery.trim() && products.length > 0 && (
              <p className="text-center py-10 text-gray-500">
                You've reached the end
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer1 />
    </div>
  );
}

export default HomePage;