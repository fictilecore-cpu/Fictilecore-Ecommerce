'use client';

import React, { useEffect, useState, useRef } from 'react';
import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/types';
import Navbar from '../components/Navbar';
import Footer1 from '../components/Footer1';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const API_URL =
    'http://localhost:8080/api/products/page?page=';

  /*
  FETCH PRODUCTS
  */
  const fetchProducts = async (pageNumber: number) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}${pageNumber}&size=8`);

      const data = await res.json();

      if (data.content && data.content.length > 0) {
        setProducts((prev) => [...prev, ...data.content]);
        setPage(pageNumber);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  /*
  INITIAL LOAD
  */
  useEffect(() => {
    fetchProducts(0);
  }, []);

  /*
  INTERSECTION OBSERVER
  */
  const lastProductRef = (node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProducts(page + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-center mb-10">
          All Products
        </h1>

        {/* PRODUCT GRID */}

        <div
          className="
          grid gap-5
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
        >
          {products.map((product, index) => {

            if (index === products.length - 1) {
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

        {/* LOADING SPINNER */}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* END MESSAGE */}

        {!hasMore && (
          <p className="text-center text-gray-500 py-10">
            No more products
          </p>
        )}

      </main>

      <Footer1 />

    </div>
  );
}