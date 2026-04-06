'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/app/types';
import { useCart } from '@/app/context/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const FALLBACK_IMAGE = '/placeholder.png';
const BACKEND_URL = 'https://fictilecore.com';

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(FALLBACK_IMAGE);

  // Add-to-cart animation states
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  /*
   IMAGE ARRAY PARSER
   Handles:
   - string
   - comma separated string
   - array
  */
  const imagesArray = useMemo(() => {
    if (!product.imagePaths) return [];

    if (Array.isArray(product.imagePaths)) {
      return product.imagePaths.filter(Boolean);
    }

    return String(product.imagePaths)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
  }, [product.imagePaths]);

  /*
   BUILD SAFE IMAGE URL
  */
  const buildImageURL = (path?: string) => {
    if (!path) return FALLBACK_IMAGE;

    const clean = path.trim();

    if (clean.startsWith('http')) return clean;

    return `${BACKEND_URL}${clean.startsWith('/') ? '' : '/'}${clean}`;
  };

  /*
   Reset image when product changes
  */
  useEffect(() => {
    if (imagesArray.length > 0) {
      setSelectedImage(imagesArray[0]);
    } else {
      setSelectedImage(FALLBACK_IMAGE);
    }
  }, [imagesArray]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isAdding || justAdded || !product.stockCount) return;

    setIsAdding(true);

    // Perform the actual add to cart
    addToCart(product);

    // Animation timing
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);

      // Reset success state after showing feedback
      setTimeout(() => {
        setJustAdded(false);
      }, 1800); // 1.8 seconds — adjust as you like
    }, 600); // brief "adding" delay — can be removed if addToCart is sync
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <Link href={`/product/${product.id}`} className="block">
        {/* IMAGE AREA */}
        <div className="relative overflow-hidden">
          <Image
            src={buildImageURL(selectedImage)}
            alt={product.name || 'Product'}
            width={400}
            height={260}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 300px"
            loading="lazy"
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = FALLBACK_IMAGE;
            }}
          />

          {/* THUMBNAILS */}
          {imagesArray.length > 1 && (
            <div className="absolute bottom-16 left-3 flex space-x-1">
              {imagesArray.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImage(img);
                  }}
                  className={`w-7 h-7 rounded border overflow-hidden bg-white ${
                    selectedImage === img ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={buildImageURL(img)}
                    alt={`thumb-${i}`}
                    width={28}
                    height={28}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.isNew && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                NEW
              </span>
            )}
            {product.isOnSale && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                SALE
              </span>
            )}
          </div>

          {/* WISHLIST */}
          <motion.button
            onClick={handleToggleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </motion.button>

          {/* QUICK VIEW */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <button className="w-full bg-white/90 backdrop-blur text-gray-800 py-2 rounded-full font-medium hover:bg-white transition flex items-center justify-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Quick View</span>
            </button>
          </motion.div>
        </div>

        {/* PRODUCT INFO */}
        <div className="p-5">
          <div className="mb-3">
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              {product.subcategory || 'General'}
            </span>
          </div>

          <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition text-lg">
            {product.name}
          </h3>

          {/* PRICE */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <span className="text-xs text-gray-600">
              {product.stockCount || 0} left
            </span>
          </div>
        </div>
      </Link>

      {/* ADD TO CART BUTTON with animation */}
      <div className="px-5 pb-5">
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding || justAdded || !product.stockCount}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          animate={
            justAdded
              ? {
                  scale: [1, 1.12, 1],
                  backgroundColor: ['#10b981', '#059669', '#10b981'],
                }
              : {}
          }
          transition={{ duration: 0.5 }}
          className={`
            w-full py-3 rounded-full font-semibold flex items-center justify-center space-x-2 transition-all duration-300
            ${
              justAdded
                ? 'bg-green-600 text-white shadow-lg'
                : isAdding
                ? 'bg-gray-400 text-white cursor-wait'
                : product.stockCount
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {justAdded ? (
            <>
              <Check className="h-5 w-5" />
              <span>Added!</span>
            </>
          ) : isAdding ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>{product.stockCount ? 'Add to Cart' : 'Out of Stock'}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;